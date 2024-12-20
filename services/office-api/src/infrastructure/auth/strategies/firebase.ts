import { Inject, Injectable, Logger, LoggerService, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";
import { Strategy } from "passport-firebase-jwt";
import { app } from "firebase-admin";

import { defaultChainId, EnabledLanguages } from "@framework/constants";
import { MerchantStatus, UserRole, UserStatus } from "@framework/types";

import { UserService } from "../../user/user.service";
import { UserEntity } from "../../user/user.entity";
import { APP_PROVIDER } from "../auth.constants";

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, "firebase-http") {
  constructor(
    @Inject(APP_PROVIDER)
    private readonly admin: app.App,
    private readonly userService: UserService,
    @Inject(Logger)
    private readonly loggerService: LoggerService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  public async validate(payload: string): Promise<UserEntity> {
    const data = await this.admin
      .auth()
      .verifyIdToken(payload, true)
      .catch(error => {
        this.loggerService.error(error);
        throw new UnauthorizedException("unauthorized");
      });

    let userEntity = await this.userService.findOne(
      { sub: data.sub },
      { relations: { merchant: { chainLinkSubscriptions: true } } },
    );

    if (!userEntity) {
      const firebaseUser = await this.admin
        .auth()
        .getUser(data.sub)
        .catch(error => {
          this.loggerService.error(error);
        });

      userEntity = await this.userService.import({
        displayName: firebaseUser?.displayName,
        email: firebaseUser?.email,
        language: EnabledLanguages.EN,
        imageUrl: firebaseUser?.photoURL,
        userRoles: [UserRole.CUSTOMER],
        userStatus: UserStatus.ACTIVE,
        sub: data.sub,
        chainId: Number(defaultChainId),
      });
    }

    // Only SuperAdmin can login to office
    const roles = [UserRole.SUPER];
    if (!userEntity.userRoles.some(role => roles.includes(role))) {
      throw new UnauthorizedException("userHasWrongRole");
    }

    if (userEntity.userStatus !== UserStatus.ACTIVE) {
      throw new UnauthorizedException("userIsNotActive");
    }

    if (userEntity.merchant.merchantStatus !== MerchantStatus.ACTIVE) {
      throw new UnauthorizedException("merchantIsNotActive");
    }

    // if (data.email && !data.email_verified) {
    //   throw new UnauthorizedException("emailIsNotVerified");
    // }

    return userEntity;
  }
}
