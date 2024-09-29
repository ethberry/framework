import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { app } from "firebase-admin";

import type { IWalletConnectDto, IFirebaseToken } from "@ethberry/nest-js-module-wallet-connect";
import { MetamaskService } from "@ethberry/nest-js-module-metamask";
import { UserRole } from "@framework/types";

import { UserService } from "../user/user.service";
import { APP_PROVIDER } from "./auth.constants";

@Injectable()
export class AuthWalletConnectService {
  constructor(
    @Inject(APP_PROVIDER)
    private readonly admin: app.App,
    private readonly userService: UserService,
    private readonly metamaskService: MetamaskService,
  ) {}

  public async login(dto: IWalletConnectDto): Promise<IFirebaseToken> {
    const { nonce, signature, wallet } = dto;

    if (!this.metamaskService.isValidSignature({ signature, wallet, nonce })) {
      throw new ForbiddenException("signatureDoesNotMatch");
    }

    const userEntity = await this.userService.findOne({ wallet: wallet.toLowerCase() });

    if (!userEntity) {
      throw new ForbiddenException("userNotFound");
    }

    const roles = [UserRole.SUPER, UserRole.ADMIN, UserRole.OWNER, UserRole.MANAGER];
    if (!userEntity.userRoles.some(role => roles.includes(role))) {
      throw new ForbiddenException("userHasWrongRole");
    }

    const token = await this.admin.auth().createCustomToken(userEntity.sub);

    return { token };
  }
}
