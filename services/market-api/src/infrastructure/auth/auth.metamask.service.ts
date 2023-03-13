import { ForbiddenException, forwardRef, Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { app } from "firebase-admin";

import { IMetamaskDto, MetamaskService } from "@gemunion/nest-js-module-metamask";
import { EnabledLanguages, testChainId } from "@framework/constants";
import { UserRole, UserStatus } from "@framework/types";

import { UserService } from "../user/user.service";
import { APP_PROVIDER } from "./auth.constants";
import { ICustomToken } from "./interfaces";

@Injectable()
export class AuthMetamaskService {
  constructor(
    @Inject(APP_PROVIDER)
    private readonly admin: app.App,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly metamaskService: MetamaskService,
  ) {}

  public async login(dto: IMetamaskDto): Promise<ICustomToken> {
    const { nonce, signature } = dto;
    const wallet = dto.wallet.toLowerCase();

    if (!this.metamaskService.isValidSignature({ signature, wallet, nonce })) {
      throw new ForbiddenException("signatureDoesNotMatch");
    }

    let userEntity = await this.userService.findOne({ wallet });

    if (!userEntity) {
      const userFb = await this.admin.auth().createUser({});

      const chainId = ~~this.configService.get<number>("CHAIN_ID", testChainId);

      userEntity = await this.userService.import({
        displayName: wallet,
        language: EnabledLanguages.EN,
        userRoles: [UserRole.CUSTOMER],
        userStatus: UserStatus.ACTIVE,
        sub: userFb.uid,
        wallet,
        chainId,
      });
    }

    const token = await this.admin.auth().createCustomToken(userEntity.sub);

    return { token };
  }
}
