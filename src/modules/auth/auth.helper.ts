import { Response } from "express";
import config from "../../config/env";
import { client } from "../../config/redis";
import { TokenService } from "../../shared/services/token.service";

export const setAuthCookies = async (
    res: Response,
    userId: string,
    tokenService: TokenService
) => {
    const refreshToken = tokenService.generateRefreshToken(userId)
    const accessToken = tokenService.generateAccessToken(userId)

    await client.set(`refresh_token:${userId}`, refreshToken, {
        expiration: { type: "EX", value: 7 * 24 * 60 * 60 }
    });

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: config.nodeEnv === "production",
        sameSite: "lax",
        maxAge: 30 * 60 * 1000
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: config.nodeEnv === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return { refreshToken, accessToken }
}