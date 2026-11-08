import jwt, { SignOptions } from "jsonwebtoken";
import config from "../../config/env";
import { BaseError } from "../../common/errors/base.error";

const JWT_REFRESH_TOKEN_SECRET = config.jwtRefreshSecret;
const JWT_ACCESS_TOKEN_SECRET = config.jwtAccessSecret;
const JWT_REFRESH_TOKEN_EX = config.refreshTokenEx;
const JWT_ACCESS_TOKEN_EX = config.accessTokenEx;

export class TokenService {
  generateAccessToken(userId: string): string {
    if (!JWT_ACCESS_TOKEN_SECRET) {
      throw new BaseError("ConfigurationError", 500, false, "JWT access secret is not configured")
    }
    return jwt.sign({ userId }, JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: JWT_ACCESS_TOKEN_EX as SignOptions["expiresIn"],
    });
  }

  generateRefreshToken(userId: string): string {
    if (!JWT_REFRESH_TOKEN_SECRET) {
      throw new BaseError("ConfigurationError", 500, false, "JWT refresh secret is not configured")
    }
    return jwt.sign({ userId }, JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: JWT_REFRESH_TOKEN_EX as SignOptions["expiresIn"],
    });
  }
  
  verifyAccessToken(token: string): { userId: string } {
    try {
      return jwt.verify(token, JWT_ACCESS_TOKEN_SECRET) as { userId: string };
    } catch (error) {
      throw new BaseError(
        "InvalidToken",
        401,
        true,
        "Invalid or expired access token"
      );
    }
  }

  verifyRefreshToken(token: string): { userId: string } {
    try {
      return jwt.verify(token, JWT_REFRESH_TOKEN_SECRET) as { userId: string };
    } catch (error) {
      throw new BaseError(
        "InvalidToken",
        401,
        true,
        "Invalid or expired refresh token"
      );
    }
  }
}