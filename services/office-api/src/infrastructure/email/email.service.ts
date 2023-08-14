import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy } from "@nestjs/microservices";

import { companyName, loremIpsum } from "@gemunion/constants";
import { ContactType, EmailType, OtpType, RmqProviderType } from "@framework/types";

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
    return this.emailClientProxy
      .emit(EmailType.DUMMY, {
        user: userEntity,
      })
      .toPromise();
  }

  public async feedback(userEntity: UserEntity): Promise<any> {
    return this.emailClientProxy
      .emit(EmailType.FEEDBACK, {
        user: userEntity,
        feedback: {
          text: "Test feedback",
        },
      })
      .toPromise();
  }

  public async contact(userEntity: UserEntity): Promise<any> {
    return this.emailClientProxy
      .emit(EmailType.CONTACT, {
        contactType: ContactType.REQUEST_DEMO,
        email: userEntity.email,
        displayName: userEntity.displayName,
        companyName,
        jobTitle: "QA engineer",
        text: loremIpsum,
        features: JSON.stringify({
          erc20: true,
          erc721: true,
        }),
      })
      .toPromise();
  }

  public async link(userEntity: UserEntity): Promise<any> {
    return this.emailClientProxy
      .emit(EmailType.LINK_TOKEN, {
        merchant: userEntity.merchant,
      })
      .toPromise();
  }

  public async invite(userEntity: UserEntity): Promise<any> {
    const otpEntity = await this.otpService.getOtp(OtpType.EMAIL, userEntity);

    return this.emailClientProxy
      .emit(EmailType.INVITE, {
        user: userEntity,
        otp: otpEntity,
        baseUrl: this.configService.get<string>("MARKET_FE_URL", "http://localhost:3006"),
      })
      .toPromise();
  }
}
