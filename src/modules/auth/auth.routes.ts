import { Router } from "express";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { AuthRepository } from "./auth.repository";
import { TokenService } from "../../shared/services/token.service";
import { EmailService } from "../../shared/services/email/email.service";
import { EmailVerificationTokenService } from "./services/email-verification-token.service";
import { getUserIdFromRefreshToken } from "../../middleware/auth/refresh.middleware";

const router = Router();
const authRepository = new AuthRepository()
const emailService = new EmailService()
const emailVerificationTokenService = new EmailVerificationTokenService()
const tokenService = new TokenService()
const authService = new AuthService(authRepository, emailService, emailVerificationTokenService, tokenService);
const authController = new AuthController(authService, tokenService);

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/verify", authController.verify);
router.post("/resend-verification-link", authController.resendVerificationLink);
router.get("/refresh", getUserIdFromRefreshToken, authController.refresh);
export default router;

