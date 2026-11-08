import { BaseError } from "../../common/errors/base.error";
import sql from "../../config/db";
import { CreateUserDTO, IUser } from "./auth.types";

export class AuthRepository {
    async findByEmail(email: string): Promise<{ id: string, password: string } | undefined> {
        const [existingUser] = await sql<{ id: string, password: string }[]>`
          SELECT id, password, email FROM users WHERE email = ${email} LIMIT 1
        `;

        return existingUser
    }

    async findByID(userId: string) {
        const [existingUser] = await sql<{ id: string, password: string, email: string }[]>`
          SELECT id, password, email FROM users WHERE id = ${userId} LIMIT 1
        `;

        return existingUser
    }

    async createUser(data: CreateUserDTO, hashedPassword: string) {
        const [newUser] = await sql<IUser[]>`
            INSERT INTO users (name, email, password)
             VALUES (${data.name}, ${data.email}, ${hashedPassword})
             RETURNING id, name, email, created_at
        `;

        return newUser
    }

    async verifyUser(userId: string) {
        await sql`
          UPDATE users SET is_verified = TRUE
          WHERE id = ${userId}
        `
    }
}