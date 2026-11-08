import { NextFunction, Request, Response } from "express";
import { BaseError } from "../../common/errors/base.error";
import { TokenService } from "../../shared/services/token.service";
import sql from "../../config/db";
import { UserRole } from "../../modules/auth/auth.types";

const tokenService = new TokenService()

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    try {
        const accessToken = req.cookies["accessToken"]

        if (!accessToken) {
            throw new BaseError(
                "TokenNotFound",
                401,
                true,
                "Token not found"
            );
        }

        const decoded = tokenService.verifyAccessToken(accessToken)
        req.user = decoded

        next()
    } catch (error) {
        next(error)
    }
}

export function requireRole(...allowedRoles: UserRole[]) {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const user = await sql<{ role: UserRole }[]>`
                SELECT role
                FROM users
                WHERE id = ${req.user.userId}
                LIMIT 1
            `;

            if (!user[0]) {
                throw new BaseError("UserNotFound", 401, true, "Authenticated user not found")
            }

            if (!allowedRoles.includes(user[0].role)) {
                throw new BaseError("Forbidden", 403, true, "You do not have permission to perform this action")
            }

            req.user.role = user[0].role;
            next()
        } catch (error) {
            next(error)
        }
    };
}