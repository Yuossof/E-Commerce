import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { CreateUserDTO, ILoginUser } from "./auth.types";
import { setAuthCookies } from "./auth.helper";
import { TokenService } from "../../shared/services/token.service";
import config from "../../config/env";

export class AuthController {
  private authService: AuthService;
  private tokenService: TokenService

  constructor(authService: AuthService, tokenService: TokenService) {
    this.authService = authService;
    this.tokenService = tokenService
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as CreateUserDTO;
      const newUser = await this.authService.register(data);
      this.authService.sendVerificationLink(newUser.email) // TODO: This is should work in the background
      return res.status(200).json({
        success: true,
        data: newUser,
      });
    } catch (error) {
      next(error);
    }
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as ILoginUser;
      const { userId } = await this.authService.login(data);

      await setAuthCookies(res, userId, this.tokenService)

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: { userId },
      });

    } catch (error) {
      next(error);
    }
  }

  resendVerificationLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body
      await this.authService.sendVerificationLink(data.email)
      return res.status(200).json({
        message: "Verification link sent"
      })
    } catch (error) {
      next(error)
    }
  }

  verify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.query.token
      if (typeof token !== "string" || !token) {
        return res.status(400).json({ success: false, message: "Verification token is required" })
      }
      const userId = await this.authService.verify(token)
      await setAuthCookies(res, userId, this.tokenService)
      return res.status(200).json({
        message: "email verified successfully"
      })
    } catch (error) {
      next(error)
    }
  }



  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies["refreshToken"]
      const accessToken = await this.authService.refresh(req.user.userId, refreshToken)

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: config.nodeEnv === "production",
        sameSite: "lax",
        maxAge: 30 * 60 * 1000
      })

      return res.status(200).json({
        success: true,
        message: "Token refreshed successfully"
      });
    } catch (error) {
      next(error)
    }
  }

}
