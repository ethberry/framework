import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { app } from "firebase-admin";

import type { IMetamaskDto } from "@gemunion/nest-js-module-metamask";
import { MetamaskService } from "@gemunion/nest-js-module-metamask";
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
    const { displayName, email, imageUrl, nonce, signature, wallet } = dto;

    if (!this.metamaskService.isValidSignature({ signature, wallet, nonce })) {
      throw new ForbiddenException("signatureDoesNotMatch");
    }

    let userEntity = await this.userService.findOne({ wallet: wallet.toLowerCase() });

    if (!userEntity) {
      let userFb;

      // CHECK IF USER EMAIL EXISTS IN FIREBASE
      if (email) {
        try {
          userFb = await this.admin.auth().getUserByEmail(email);
        } catch (err) {
          console.error(err.errorInfo, "firebase.getUserByEmail");
        }
      }
      // CREATE USER IN FIREBASE
      if (!userFb) {
        userFb = await this.admin.auth().createUser({
          displayName,
          email,
          photoURL: imageUrl,
          emailVerified: !!email,
        });
      }

      userEntity = await this.userService.import({
        displayName: displayName || wallet.toLowerCase(),
        imageUrl: imageUrl || "",
        email: email || "",
        language: EnabledLanguages.EN,
        userRoles: [UserRole.CUSTOMER],
        userStatus: UserStatus.ACTIVE,
        sub: userFb.uid,
        wallet: wallet.toLowerCase(),
        chainId: Number(defaultChainId),
      });
    }

    const token = await this.admin.auth().createCustomToken(userEntity.sub);

    return { token };
  }
}
