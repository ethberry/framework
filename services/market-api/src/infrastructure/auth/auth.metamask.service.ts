import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { app } from "firebase-admin";

import type { IMetamaskDto, IFirebaseToken } from "@ethberry/nest-js-module-metamask";
import { MetamaskService } from "@ethberry/nest-js-module-metamask";
import { defaultChainId, EnabledLanguages } from "@framework/constants";
import { UserRole, UserStatus } from "@framework/types";

import { UserService } from "../user/user.service";
import { APP_PROVIDER } from "./auth.constants";

@Injectable()
export class AuthMetamaskService {
  constructor(
    @Inject(APP_PROVIDER)
    private readonly admin: app.App,
    private readonly userService: UserService,
    private readonly metamaskService: MetamaskService,
  ) {}

  public async login(dto: IMetamaskDto): Promise<IFirebaseToken> {
    const { nonce, signature, wallet } = dto;

    if (!this.metamaskService.isValidSignature({ signature, wallet, nonce })) {
      throw new ForbiddenException("signatureDoesNotMatch");
    }

    // look for user wallet
    let userEntity = await this.userService.findOne({ wallet: wallet.toLowerCase() });

    // if new wallet
    if (!userEntity) {
      // check if user email exists in firebase

      const user = await this.findOrCreateUserInFirebase(dto);

      // import new user to our db
      userEntity = await this.userService.import({
        sub: user.uid,
        displayName: wallet.toLowerCase(),
        imageUrl: "",
        email: "",
        language: EnabledLanguages.EN,
        userRoles: [UserRole.CUSTOMER],
        userStatus: UserStatus.ACTIVE,
        wallet: wallet.toLowerCase(),
        chainId: Number(defaultChainId),
      });
    }

    // LOGIN USER via firebase
    const token = await this.admin.auth().createCustomToken(userEntity.sub);

    return { token };
  }

  public async findOrCreateUserInFirebase(_dto: IMetamaskDto) {
    return this.admin.auth().createUser({});
  }
}
