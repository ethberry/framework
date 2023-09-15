import { Inject, Injectable, Logger, LoggerService, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";
import { Strategy } from "passport-firebase-jwt";
import { app } from "firebase-admin";

import { defaultChainId, EnabledLanguages } from "@framework/constants";
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

    let userEntity = await this.userService.findOne({ sub: data.sub }, { relations: { merchant: true } });

    if (!userEntity) {
      const firebaseUser = await this.admin
        .auth()
        .getUser(data.sub)
        .catch(error => {
          this.loggerService.error(error);
        });

      userEntity = await this.userService.import({
        displayName: firebaseUser?.displayName,
        language: EnabledLanguages.EN,
        imageUrl: firebaseUser?.photoURL,
        userRoles: [UserRole.CUSTOMER],
        userStatus: UserStatus.ACTIVE,
        sub: data.sub,
        chainId: Number(defaultChainId),
      });
    }

    return userEntity;
  }
}
