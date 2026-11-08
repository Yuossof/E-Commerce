import jwt, { SignOptions } from "jsonwebtoken";
import config from "../config/env";

const JWT_REFRESH_TOKEN_SECRET = config.jwtRefreshSecret;
const JWT_ACCESS_TOKEN_SECRET = config.jwtAccessSecret;
const JWT_REFRESH_TOKEN_EX = config.refreshTokenEx;
const JWT_ACCESS_TOKEN_EX = config.accessTokenEx;

export class JWTutils {
  static generateToken(
    payload: { userId: string },
    type: "refreshToken" | "accessToken"
  ) {
    const isRefresh = type === "refreshToken";
    const secret = isRefresh ? JWT_REFRESH_TOKEN_SECRET : JWT_ACCESS_TOKEN_SECRET;
    const expiresIn = isRefresh ? JWT_REFRESH_TOKEN_EX : JWT_ACCESS_TOKEN_EX;

    return jwt.sign(payload, secret, {
      expiresIn: expiresIn as SignOptions["expiresIn"],
    });
  }

  static verifyToken(token: string, type: "refreshToken" | "accessToken") {
    const secret = type === "refreshToken" ? JWT_REFRESH_TOKEN_SECRET : JWT_ACCESS_TOKEN_SECRET;
    return jwt.verify(token, secret) as { userId: string };
  }
}