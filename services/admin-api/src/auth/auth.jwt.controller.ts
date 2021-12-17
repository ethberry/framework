import { Body, ClassSerializerInterceptor, Controller, HttpCode, Ip, Post, UseInterceptors } from "@nestjs/common";

import { Public } from "@gemunion/nest-js-utils";
import { IJwt } from "@gemunion/types-jwt";

import { UserCreateDto } from "../user/dto";
import { AuthService } from "./auth.service";
import {
  ForgotPasswordDto,
  LoginDto,
  LogoutDto,
  RefreshDto,
  ResendEmailVerificationDto,
  RestorePasswordDto,
  ValidatePasswordScoreDto,
  VerifyEmailDto,
} from "./dto";
import { IPasswordScoreResult } from "./interfaces";

@Public()
@Controller("/auth")
export class AuthJwtController {
  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  @HttpCode(200)
  public login(@Body() dto: LoginDto, @Ip() ip: string): Promise<IJwt> {
    return this.authService.login(dto, ip);
  }

  @Post("/refresh")
  @HttpCode(200)
  async refreshToken(@Body() dto: RefreshDto, @Ip() ip: string): Promise<IJwt> {
    return this.authService.refresh(dto, ip);
  }

  @Post("/logout")
  @HttpCode(204)
  public async logout(@Body() dto: LogoutDto): Promise<void> {
    await this.authService.logout(dto);
  }

  @Post("/signup")
  @UseInterceptors(ClassSerializerInterceptor)
  public async signup(@Body() dto: UserCreateDto, @Ip() ip: string): Promise<IJwt> {
    const userEntity = await this.authService.signup(dto);
    return this.authService.loginUser(userEntity, ip);
  }

  @Post("/forgot-password")
  @HttpCode(204)
  public forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    return this.authService.forgotPassword(dto);
  }

  @Post("/restore-password")
  @HttpCode(204)
  public restorePassword(@Body() dto: RestorePasswordDto): Promise<void> {
    return this.authService.restorePassword(dto);
  }

  @Post("/email-verification")
  @HttpCode(204)
  public emailVerification(@Body() dto: VerifyEmailDto): Promise<void> {
    return this.authService.emailVerification(dto);
  }

  @Post("/resend-email-verification")
  @HttpCode(204)
  public resendEmailVerification(@Body() dto: ResendEmailVerificationDto): Promise<void> {
    return this.authService.resendEmailVerification(dto);
  }

  @Post("/get-password-score")
  public getPasswordScore(@Body() dto: ValidatePasswordScoreDto): IPasswordScoreResult {
    return this.authService.getPasswordScore(dto);
  }
}
