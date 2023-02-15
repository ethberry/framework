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

  public async dummy(userEntity: UserEntity): Promise<any> {
    return this.emailClientProxy
      .emit(EmailType.DUMMY, {
        user: userEntity,
      })
      .toPromise();
  }

  public async feedback(userEntity: UserEntity): Promise<any> {
    return this.emailClientProxy
      .emit(EmailType.DUMMY, {
        user: userEntity,
        feedback: {
          text: "Test feedback",
        },
      })
      .toPromise();
  }

  public async link(userEntity: UserEntity): Promise<any> {
    return this.emailClientProxy
      .emit(EmailType.DUMMY, {
        user: userEntity,
        contract: {
          title: "TEST",
        },
      })
      .toPromise();
  }
}
