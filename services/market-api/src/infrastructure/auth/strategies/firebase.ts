import { Inject, Injectable, Logger, LoggerService, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt } from "passport-jwt";
import { Strategy } from "passport-firebase-jwt";
import { app } from "firebase-admin";

import { EnabledLanguages, testChainId } from "@framework/constants";
import { UserRole, UserStatus } from "@framework/types";

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
    private readonly configService: ConfigService,
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

    let userEntity = await this.userService.findOne({ sub: data.sub });

    if (!userEntity) {
      const firebaseUser = await this.admin
        .auth()
        .getUser(data.sub)
        .catch(error => {
          this.loggerService.error(error);
        });

      const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

      userEntity = await this.userService.import({
        displayName: firebaseUser?.displayName,
        email: firebaseUser?.email,
        language: EnabledLanguages.EN,
        imageUrl: firebaseUser?.photoURL,
        userRoles: [UserRole.CUSTOMER],
        userStatus: UserStatus.ACTIVE,
        sub: data.sub,
        chainId,
      });
    }

    const roles = [UserRole.ADMIN, UserRole.OWNER, UserRole.MANAGER, UserRole.CUSTOMER];
    if (!userEntity.userRoles.some(role => roles.includes(role))) {
      throw new UnauthorizedException("userHasWrongRole");
    }

    if (userEntity.userStatus !== UserStatus.ACTIVE) {
      throw new UnauthorizedException("userIsNotActive");
    }

    // if (data.email && !data.email_verified) {
    //   throw new UnauthorizedException("emailIsNotVerified");
    // }

    return userEntity;
  }
}
