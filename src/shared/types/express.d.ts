import { UserRole } from "../../modules/auth/auth.types";

declare global {
    namespace Express {
        interface Request {
            user: {
                userId: string;
                role?: UserRole;
            };
            rawBody?: Buffer;
        }
    }
}

export { };