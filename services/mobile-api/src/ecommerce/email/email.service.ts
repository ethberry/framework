import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy } from "@nestjs/microservices";

import { EmailType, RmqProviderType } from "@framework/types";

import { UserEntity } from "../user/user.entity";

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(RmqProviderType.EML_SERVICE)
    private readonly emailClientProxy: ClientProxy,
  ) {}

  public welcome(userEntity: UserEntity): Promise<any> {
    return this.emailClientProxy
      .emit(EmailType.DUMMY, {
        user: userEntity,
        baseUrl: this.configService.get<string>("MARKET_FE_URL", "http://localhost:3002"),
      })
      .toPromise();
  }
}
