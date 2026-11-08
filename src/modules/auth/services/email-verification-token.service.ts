import crypto from "crypto"
import { client } from "../../../config/redis";

export class EmailVerificationTokenService {
    async create(userId: string) {
        const token = crypto.randomBytes(32).toString(
            "hex")

        const redisKey = `verify_email:${token}`;

        await client.set(redisKey, userId, {
            expiration: {
                type: "EX",
                value: 900
            }
        })

        return token
    }

    async getUserId(token: string): Promise<string | null> {
        const redisKey = `verify_email:${token}`;
        return await client.get(redisKey)
    }

    async delete(token: string): Promise<void> {
        const redisKey = `verify_email:${token}`;
        await client.del(redisKey)
    }
}