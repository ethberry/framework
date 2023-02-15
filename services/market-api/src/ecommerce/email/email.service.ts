import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy } from "@nestjs/microservices";

import { EmailType, RmqProviderType } from "@framework/types";

import { UserEntity } from "../user/user.entity";
import { IFeedbackCreateDto } from "../feedback/interfaces";

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(RmqProviderType.EML_SERVICE)
    private readonly emailClientProxy: ClientProxy,
  ) {}

  public dummy(userEntity: UserEntity): Promise<any> {
    return this.emailClientProxy
      .emit(EmailType.DUMMY, {
        user: userEntity,
        baseUrl: this.configService.get<string>("MARKET_FE_URL", "http://localhost:3002"),
      })
      .toPromise();
  }

  public feedback(dto: IFeedbackCreateDto, userEntity: UserEntity): Promise<any> {
    return this.emailClientProxy
      .emit(EmailType.FEEDBACK, {
        user: userEntity,
        feedback: dto,
      })
      .toPromise();
  }
}
