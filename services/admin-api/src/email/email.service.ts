import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy } from "@nestjs/microservices";

import { EmailType, OtpType, RmqProviderType } from "@framework/types";

import { UserEntity } from "../user/user.entity";
import { OtpService } from "../otp/otp.service";

@Injectable()
export class EmailService {
  constructor(
    private readonly otpService: OtpService,
    private readonly configService: ConfigService,
    @Inject(RmqProviderType.EML_SERVICE)
    private readonly emailClientProxy: ClientProxy,
  ) {}

  public welcome(userEntity: UserEntity): Promise<any> {
    return this.emailClientProxy
      .emit(EmailType.WELCOME, {
        user: userEntity,
        baseUrl: this.configService.get<string>("ADMIN_FE_URL", "http://localhost:3002"),
      })
      .toPromise();
  }

  public async emailVerification(userEntity: UserEntity): Promise<any> {
    const otpEntity = await this.otpService.getOtp(OtpType.EMAIL, userEntity);

    return this.emailClientProxy
      .emit(EmailType.EMAIL_VERIFICATION, {
        user: userEntity,
        otp: otpEntity,
        baseUrl: this.configService.get<string>("ADMIN_FE_URL", "http://localhost:3002"),
      })
      .toPromise();
  }

  public async forgotPassword(userEntity: UserEntity): Promise<any> {
    const otpEntity = await this.otpService.getOtp(OtpType.PASSWORD, userEntity);

    return this.emailClientProxy
      .emit(EmailType.FORGOT_PASSWORD, {
        user: userEntity,
        otp: otpEntity,
        baseUrl: this.configService.get<string>("ADMIN_FE_URL", "http://localhost:3002"),
      })
      .toPromise();
  }

  public restorePassword(userEntity: UserEntity): Promise<any> {
    return this.emailClientProxy
      .emit(EmailType.RESTORE_PASSWORD, {
        user: userEntity,
        baseUrl: this.configService.get<string>("ADMIN_FE_URL", "http://localhost:3002"),
      })
      .toPromise();
  }
}
