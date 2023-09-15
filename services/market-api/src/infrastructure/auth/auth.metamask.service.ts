import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { app } from "firebase-admin";

import { IMetamaskDto, MetamaskService } from "@gemunion/nest-js-module-metamask";
import { defaultChainId, EnabledLanguages } from "@framework/constants";
import { UserRole, UserStatus } from "@framework/types";

import { UserService } from "../user/user.service";
import { APP_PROVIDER } from "./auth.constants";
import type { ICustomToken } from "./interfaces";

@Injectable()
export class AuthMetamaskService {
  constructor(
    @Inject(APP_PROVIDER)
    private readonly admin: app.App,
    private readonly userService: UserService,
    private readonly metamaskService: MetamaskService,
  ) {}

  public async login(dto: IMetamaskDto): Promise<ICustomToken> {
    const { nonce, signature, wallet } = dto;

    if (!this.metamaskService.isValidSignature({ signature, wallet, nonce })) {
      throw new ForbiddenException("signatureDoesNotMatch");
    }

    let userEntity = await this.userService.findOne({ wallet });

    if (!userEntity) {
      const userFb = await this.admin.auth().createUser({});

      userEntity = await this.userService.import({
        displayName: wallet,
        language: EnabledLanguages.EN,
        userRoles: [UserRole.CUSTOMER],
        userStatus: UserStatus.ACTIVE,
        sub: userFb.uid,
        wallet,
        chainId: Number(defaultChainId),
      });
    }

    const token = await this.admin.auth().createCustomToken(userEntity.sub);

    return { token };
  }
}
