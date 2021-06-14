import {Test, TestingModule} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";

import {DatabaseModule} from "../database/database.module";
import {TokenModule} from "../token/token.module";
import {UserModule} from "../user/user.module";
import {emailServiceProvider} from "../common/providers";
import {AuthService} from "./auth.service";
import {AuthEntity} from "./auth.entity";
import {JwtLocalStrategy} from "./strategies";

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `.env.${process.env.NODE_ENV as string}`,
        }),
        DatabaseModule,
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
      ],
      providers: [emailServiceProvider, AuthService, JwtLocalStrategy],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(authService).toBeDefined();
  });
});
