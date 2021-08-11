import { Body, ClassSerializerInterceptor, Controller, HttpCode, Ip, Post, UseInterceptors } from "@nestjs/common";

import { Public } from "@gemunionstudio/nest-js-utils";
import { IJwt } from "@gemunionstudio/framework-types/dist/jwt";

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
  public login(@Body() data: LoginDto, @Ip() ip: string): Promise<IJwt> {
    return this.authService.login(data, ip);
  }

  @Post("/refresh")
  @HttpCode(200)
  async refreshToken(@Body() data: RefreshDto, @Ip() ip: string): Promise<IJwt> {
    return this.authService.refresh(data, ip);
  }

  @Post("/logout")
  @HttpCode(204)
  public async logout(@Body() data: LogoutDto): Promise<void> {
    await this.authService.logout(data);
  }

  @Post("/signup")
  @UseInterceptors(ClassSerializerInterceptor)
  public async signup(@Body() data: UserCreateDto, @Ip() ip: string): Promise<IJwt> {
    const userEntity = await this.authService.signup(data);
    return this.authService.loginUser(userEntity, ip);
  }

  @Post("/forgot-password")
  @HttpCode(204)
  public forgotPassword(@Body() data: ForgotPasswordDto): Promise<void> {
    return this.authService.forgotPassword(data);
  }

  @Post("/restore-password")
  @HttpCode(204)
  public restorePassword(@Body() data: RestorePasswordDto): Promise<void> {
    return this.authService.restorePassword(data);
  }

  @Post("/email-verification")
  @HttpCode(204)
  public emailVerification(@Body() data: VerifyEmailDto): Promise<void> {
    return this.authService.emailVerification(data);
  }

  @Post("/resend-email-verification")
  @HttpCode(204)
  public resendEmailVerification(@Body() data: ResendEmailVerificationDto): Promise<void> {
    return this.authService.resendEmailVerification(data);
  }

  @Post("/get-password-score")
  public getPasswordScore(@Body() data: ValidatePasswordScoreDto): IPasswordScoreResult {
    return this.authService.getPasswordScore(data);
  }
}
