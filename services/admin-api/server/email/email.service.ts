import {Inject, Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {ClientProxy} from "@nestjs/microservices";

import {EmailType, ProviderType, TokenType} from "@gemunionstudio/framework-types";

import {UserEntity} from "../user/user.entity";
import {TokenService} from "../token/token.service";

@Injectable()
export class EmailService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    @Inject(ProviderType.EMAIL_SERVICE)
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
    const token = await this.tokenService.getToken(TokenType.EMAIL, userEntity);

    return this.emailClientProxy
      .emit(EmailType.EMAIL_VERIFICATION, {
        user: userEntity,
        token,
        baseUrl: this.configService.get<string>("ADMIN_FE_URL", "http://localhost:3002"),
      })
      .toPromise();
  }

  public async forgotPassword(userEntity: UserEntity): Promise<any> {
    const token = await this.tokenService.getToken(TokenType.PASSWORD, userEntity);

    return this.emailClientProxy
      .emit(EmailType.FORGOT_PASSWORD, {
        user: userEntity,
        token,
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
