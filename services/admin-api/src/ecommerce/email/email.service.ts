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

  public async dummy(userEntity: UserEntity): Promise<any> {
    const otpEntity = await this.otpService.getOtp(OtpType.EMAIL, userEntity);

    return this.emailClientProxy
      .emit(EmailType.DUMMY, {
        user: userEntity,
        otp: otpEntity,
        baseUrl: this.configService.get<string>("ADMIN_FE_URL", "http://localhost:3002"),
      })
      .toPromise();
  }
}
