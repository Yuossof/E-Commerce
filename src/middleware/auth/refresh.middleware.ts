import { NextFunction, Request, Response } from "express";
import { BaseError } from "../../common/errors/base.error";
import { TokenService } from "../../shared/services/token.service";

const tokenService = new TokenService()

export async function getUserIdFromRefreshToken(req: Request, res: Response, next: NextFunction) {
    try {
        const refreshToken = req.cookies["refreshToken"]

        if (!refreshToken) {
            throw new BaseError(
                "TokenNotFound",
                401,
                true,
                "Token not found"
            );
        }

        const decoded = tokenService.verifyRefreshToken(refreshToken)
        req.user = decoded

        next()
    } catch (error) {
        next(error)
    }
}