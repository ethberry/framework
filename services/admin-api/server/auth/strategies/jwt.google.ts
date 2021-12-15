import { OAuth2Strategy } from "passport-google-oauth";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Profile } from "passport";

import { DefaultLanguage } from "@gemunion/framework-constants";
import { UserStatus } from "@gemunion/framework-types";

import { UserEntity } from "../../user/user.entity";
import { UserService } from "../../user/user.service";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtGoogleStrategy extends PassportStrategy(OAuth2Strategy, "jwt-google") {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>("GOOGLE_CLIENT_ID", ""),
      clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET", ""),
      callbackURL: configService.get<string>("GOOGLE_CALLBACK_URL", ""),
      scope: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"],
    });
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
