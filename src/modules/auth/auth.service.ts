import bcrypt from "bcryptjs";

import { BaseError } from "../../common/errors/base.error";
import { CreateUserDTO, ILoginUser } from "./auth.types";
import { AuthRepository } from "./auth.repository";
import { EmailVerificationTokenService } from "./services/email-verification-token.service";
import { EmailService } from "../../shared/services/email/email.service";
import { client } from "../../config/redis";
import { TokenService } from "../../shared/services/token.service";


export class AuthService {
  private authRepository: AuthRepository
  private emailService: EmailService
  private emailVerificationTokenService: EmailVerificationTokenService
  private tokenService: TokenService

  constructor(
    authRepository: AuthRepository,
    emailService: EmailService,
    emailVerificationTokenService: EmailVerificationTokenService,
    tokenService: TokenService
  ) {
    this.authRepository = authRepository
    this.emailService = emailService
    this.emailVerificationTokenService = emailVerificationTokenService
    this.tokenService = tokenService

  }

  async register(data: CreateUserDTO) {
    const email = data.email?.trim().toLowerCase()
    if (!data.name?.trim() || !email || !data.password || data.password.length < 8) {
      throw new BaseError("InvalidRegistration", 400, true, "Name, a valid email, and a password of at least 8 characters are required")
    }

    const user = await this.authRepository.findByEmail(email)

    if (user) {
      throw new BaseError(
        "UserAlreadyExists",
        409,
        true,
        "A user with this email already exists",
      );
    }

    // Hashing password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const newUser = await this.authRepository.createUser({ ...data, email }, hashedPassword)
    return newUser;
  }

  async login(data: ILoginUser) {
    const email = data.email?.trim().toLowerCase()
    if (!email || !data.password) {
      throw new BaseError("InvalidCredentials", 400, true, "Email and password are required")
    }

    const existingUser = await this.authRepository.findByEmail(email)

    if (!existingUser) {
      throw new BaseError("UserNotFound", 404, true, "User does not exist");
    }

    const isPasswordMatch = await bcrypt.compare(
      data.password,
      existingUser.password,
    );

    if (!isPasswordMatch) {
      throw new BaseError(
        "InvalidEmailOrPassword",
        400,
        true,
        "Invalid email or password",
      );
    }


    return { userId: existingUser.id };
  }

  async sendVerificationLink(email: string) {
    const user = await this.authRepository.findByEmail(email)

    if (!user) {
      throw new BaseError(
        "UserNotFound",
        404,
        true,
        "User does not exists"
      )
    }

    const token = await this.emailVerificationTokenService.create(user.id)

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    await this.emailService.sendVerificationEmail(email, verificationLink)
  }


  async verify(token: string) {
    const userId = await this.emailVerificationTokenService.getUserId(token)

    if (!userId) {
      throw new BaseError(
        "InvalidVerificationLink",
        400,
        true,
        "Invalid verification link"
      )
    }

    const user = await this.authRepository.findByID(userId)

    if (!user) {
      throw new BaseError(
        "UserNotFound",
        404,
        true,
        "User does not exists"
      )
    }

    await this.authRepository.verifyUser(user.id)

    await this.emailVerificationTokenService.delete(token)

    return user.id
  }


  async refresh(userId: string, incomingRefreshToken: string) {
    const storedToken = await client.get(`refresh_token:${userId}`) // redis
    if (!storedToken || storedToken !== incomingRefreshToken) {
      throw new BaseError("InvalidRefreshToken", 401, true, "Invalid or expired refresh token");
    }

    const accessToken = this.tokenService.generateAccessToken(userId)
    return accessToken
  }
}
