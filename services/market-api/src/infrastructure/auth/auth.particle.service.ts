import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { app } from "firebase-admin";

import type { IParticleDto } from "@gemunion/nest-js-module-particle";
import { ParticleService } from "@gemunion/nest-js-module-particle";
import { defaultChainId, EnabledLanguages } from "@framework/constants";
import { UserRole, UserStatus } from "@framework/types";

import { UserService } from "../user/user.service";
import { APP_PROVIDER } from "./auth.constants";
import type { ICustomToken } from "./interfaces";

@Injectable()
export class AuthParticleService {
  constructor(
    @Inject(APP_PROVIDER)
    private readonly admin: app.App,
    private readonly userService: UserService,
    private readonly particleService: ParticleService,
  ) {}

  public async login(dto: IParticleDto): Promise<ICustomToken> {
    const { displayName, email, imageUrl, nonce, signature, wallet } = dto;

    if (!this.particleService.isValidSignature({ signature, wallet, nonce })) {
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
        displayName: displayName || wallet.toLowerCase(),
        imageUrl: imageUrl || "",
        email: email || "",
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

  public async findOrCreateUserInFirebase(dto: IParticleDto) {
    const { displayName, email, imageUrl } = dto;

    let user;

    // get user from firebase
    if (email) {
      user = await this.admin.auth().getUserByEmail(email);
    }

    if (!user) {
      // create user
      return this.admin.auth().createUser({
        displayName,
        email,
        photoURL: imageUrl,
      });
    }

    return user;
  }
}
