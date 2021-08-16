import { Request } from "express";
import { Profile } from "passport";
import { Strategy } from "passport-facebook";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DefaultLanguage } from "@gemunion/framework-constants-misc";
import { UserStatus } from "@gemunion/framework-types";

import { UserEntity } from "../../user/user.entity";
import { UserService } from "../../user/user.service";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtFacebookStrategy extends PassportStrategy(Strategy, "jwt-facebook") {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>("FACEBOOK_CLIENT_ID", ""),
      clientSecret: configService.get<string>("FACEBOOK_CLIENT_SECRET", ""),
      callbackURL: configService.get<string>("FACEBOOK_CALLBACK_URL", ""),
      profileFields: ["id", "birthday", "email", "gender", "link", "name", "locale", "picture"],
    });
  }

  authenticate(req: Request, options?: Record<string, any>): void {
    super.authenticate(
      req,
      Object.assign(options, {
        scope: ["email"],
      }),
    );
  }

  public async validate(_accessToken: string, _refreshToken: string, profile: Profile): Promise<UserEntity> {
    const email = profile.emails![0].value.toLowerCase();
    const userEntity = await this.userService.findOne({ email });

    if (userEntity) {
      if (userEntity.userStatus !== UserStatus.ACTIVE) {
        throw new UnauthorizedException("userIsNotActive");
      }

      return userEntity;
    }

    return this.authService.import({
      email: profile.emails![0].value,
      firstName: profile.name!.givenName,
      lastName: profile.name!.familyName,
      language: DefaultLanguage,
      imageUrl: profile.photos![0].value,
      phoneNumber: "",
      userStatus: UserStatus.ACTIVE,
    });
  }
}
