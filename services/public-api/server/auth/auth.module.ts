import {Module} from "@nestjs/common";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config";

import {emailServiceProvider} from "../common/providers";
import {UserModule} from "../user/user.module";
import {TokenModule} from "../token/token.module";
import {AuthJwtController} from "./auth.jwt.controller";
import {AuthSocialController} from "./auth.social.controller";
import {AuthService} from "./auth.service";
import {AuthEntity} from "./auth.entity";
import {JwtFacebookStrategy, JwtGoogleStrategy, JwtLocalStrategy} from "./strategies";

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthEntity]),
    UserModule,
    TokenModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET_KEY", "keyboard_cat"),
      }),
    }),
    ConfigModule,
  ],
  controllers: [AuthJwtController, AuthSocialController],
  providers: [emailServiceProvider, AuthService, JwtGoogleStrategy, JwtFacebookStrategy, JwtLocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
