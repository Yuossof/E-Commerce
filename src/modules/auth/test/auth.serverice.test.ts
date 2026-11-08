import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { AuthRepository } from "../auth.repository";
import { AuthService } from "../auth.service";
import { BaseError } from "../../../common/errors/base.error";

type User = {
    id: string;
    email: string;
    name: string;
    password: string;
};

type Dependencies = {
    repository: {
        findByEmail: (email: string) => Promise<User | undefined>;
        createUser: (data: { name: string; email: string; password: string }, hashedPassword: string) => Promise<User>;
        findByID: (userId: string) => Promise<User | undefined>;
        verifyUser: (userId: string) => Promise<void>;
    };
    email: {
        sendVerificationEmail: (email: string, link: string) => Promise<void>;
    };
    verificationToken: {
        create: (userId: string) => Promise<string>;
        getUserId: (token: string) => Promise<string | null>;
        delete: (token: string) => Promise<void>;
    };
    token: Record<string, never>;
};

const createService = (
    repositoryOverrides: Partial<Dependencies["repository"]> = {},
    serviceOverrides: {
        email?: Partial<Dependencies["email"]>;
        verificationToken?: Partial<Dependencies["verificationToken"]>;
        token?: Dependencies["token"];
    } = {}
) => {
    const repository: Dependencies["repository"] = {
        findByEmail: async () => undefined,
        createUser: async (data, password) => ({
            id: "new-user",
            ...data,
            password,
        }),
        findByID: async () => undefined,
        verifyUser: async () => undefined,
        ...repositoryOverrides,
    };

    const email = {
        sendVerificationEmail: async () => undefined,
        ...serviceOverrides.email,
    };
    const verificationToken = {
        create: async () => "verification-token",
        getUserId: async () => null,
        delete: async () => undefined,
        ...serviceOverrides.verificationToken,
    };

    return {
        service: new AuthService(
            repository as AuthRepository,
            email,
            verificationToken,
            serviceOverrides.token as never
        ),
        repository,
        email,
        verificationToken,
    };
};

describe("AuthService.register", () => {
    it("normalizes the email, hashes the password, and creates the user", async () => {
        let receivedData: { name: string; email: string; password: string } | undefined;
        let receivedPassword: string | undefined;
        const { service } = createService({
            createUser: async (data, password) => {
                receivedData = data;
                receivedPassword = password;
                return { id: "1", ...data, password };
            },
        });

        const result = await service.register({
            name: "Joe",
            email: "  JOE@example.com ",
            password: "password123",
        });

        assert.equal(result.id, "1");
        assert.deepEqual(receivedData, {
            name: "Joe",
            email: "joe@example.com",
            password: "password123",
        });
        assert.notEqual(receivedPassword, "password123");
        assert.ok(receivedPassword);
    });

    it("rejects invalid registration data", async () => {
        const { service } = createService();

        await assert.rejects(
            service.register({
                name: "Joe",
                email: "joe@example.com",
                password: "short",
            }),
            (error: BaseError) =>
                error.name === "InvalidRegistration" && error.statusCode === 400
        );
    });

    it("rejects an email that is already registered", async () => {
        const { service } = createService({
            findByEmail: async () => ({
                id: "1",
                email: "joe@example.com",
                name: "Joe",
                password: "hashed",
            }),
        });

        await assert.rejects(
            service.register({
                name: "Joe",
                email: "joe@example.com",
                password: "password123",
            }),
            (error: BaseError) =>
                error.name === "UserAlreadyExists" && error.statusCode === 409
        );
    });
});

describe("AuthService.login", () => {
    it("returns the existing user's id for valid credentials", async () => {
        let receivedEmail = "";
        const { service, repository } = createService({
            findByEmail: async (email) => {
                receivedEmail = email;
                return {
                    id: "1",
                    email: "joe@example.com",
                    name: "Joe",
                    password: "$2b$10$GrhParkVKNqFYj9HeptfMulDZuEMQmYr9H/6Mpiob0VC2NL2BFu8K",
                };
            },
        });

        const result = await service.login({
            email: " JOE@example.com ",
            password: "password",
        });

        assert.deepEqual(result, { userId: "1" });
        assert.equal(receivedEmail, "joe@example.com");
        assert.equal(repository.findByEmail instanceof Function, true);
    });

    it("rejects unknown users and incorrect passwords", async () => {
        const missingUser = createService();
        await assert.rejects(
            missingUser.service.login({ email: "missing@example.com", password: "password" }),
            (error: BaseError) => error.name === "UserNotFound" && error.statusCode === 404
        );

        const wrongPassword = createService({
            findByEmail: async () => ({
                id: "1",
                email: "joe@example.com",
                name: "Joe",
                password: "$2b$10$GrhParkVKNqFYj9HeptfMulDZuEMQmYr9H/6Mpiob0VC2NL2BFu8K",
            }),
        });
        await assert.rejects(
            wrongPassword.service.login({ email: "joe@example.com", password: "wrong" }),
            (error: BaseError) =>
                error.name === "InvalidEmailOrPassword" && error.statusCode === 400
        );
    });
});

describe("AuthService verification", () => {
    it("sends a verification link for an existing user", async () => {
        let sentEmail = "";
        let sentLink = "";
        const { service } = createService(
            {
                findByEmail: async () => ({
                    id: "1",
                    email: "joe@example.com",
                    name: "Joe",
                    password: "hashed",
                }),
            },
            {
                email: {
                    sendVerificationEmail: async (email, link) => {
                        sentEmail = email;
                        sentLink = link;
                    },
                },
                verificationToken: {
                    create: async (userId) => {
                        assert.equal(userId, "1");
                        return "token";
                    },
                },
            }
        );
        process.env.FRONTEND_URL = "http://localhost:3000";

        await service.sendVerificationLink("joe@example.com");

        assert.equal(sentEmail, "joe@example.com");
        assert.equal(sentLink, "http://localhost:3000/verify-email?token=token");
    });

    it("verifies the user and deletes the consumed token", async () => {
        let verifiedUserId = "";
        let deletedToken = "";
        const { service } = createService(
            {
                findByID: async () => ({
                    id: "1",
                    email: "joe@example.com",
                    name: "Joe",
                    password: "hashed",
                }),
                verifyUser: async (userId) => {
                    verifiedUserId = userId;
                },
            },
            {
                verificationToken: {
                    getUserId: async () => "1",
                    delete: async (token) => {
                        deletedToken = token;
                    },
                },
            }
        );

        const result = await service.verify("token");

        assert.equal(result, "1");
        assert.equal(verifiedUserId, "1");
        assert.equal(deletedToken, "token");
    });

    it("rejects invalid verification tokens", async () => {
        const { service } = createService();

        await assert.rejects(
            service.verify("invalid-token"),
            (error: BaseError) =>
                error.name === "InvalidVerificationLink" && error.statusCode === 400
        );
    });
});