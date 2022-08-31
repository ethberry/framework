import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Logger } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { GemunionTypeormModule } from "@gemunion/nest-js-module-typeorm-debug";
import { EnabledLanguages } from "@framework/constants";
import { UserRole, UserStatus } from "@framework/types";

import ormconfig from "../ormconfig";
import { UserService } from "./user.service";
import { UserSeedService } from "./user.seed.service";
import { UserSeedModule } from "./user.seed.module";
import { UserEntity } from "./user.entity";
import { AuthModule } from "../auth/auth.module";
import { LicenseModule } from "@gemunion/nest-js-module-license";

describe("UserService", () => {
  let userService: UserService;
  let userSeedService: UserSeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `.env.${process.env.NODE_ENV as string}`,
        }),
        LicenseModule.forRootAsync(LicenseModule, {
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService): string => {
            return configService.get<string>("GEMUNION_API_KEY", "");
          },
        }),
        GemunionTypeormModule.forRoot(ormconfig),
        TypeOrmModule.forFeature([UserEntity]),
        UserSeedModule,
        AuthModule,
      ],
      providers: [Logger, UserService, UserSeedService],
    }).compile();

    userService = module.get<UserService>(UserService);
    userSeedService = module.get<UserSeedService>(UserSeedService);
  });

  afterEach(async () => {
    await userSeedService.tearDown();
  });

  it("should be defined", () => {
    expect(userService).toBeDefined();
  });

  describe("import", () => {
    it("should create with empty balance", async () => {
      const userEntity = await userService.import({
        displayName: "test_name",
        language: EnabledLanguages.EN,
        imageUrl: "test_url",
        userRoles: [UserRole.USER],
        userStatus: UserStatus.ACTIVE,
        sub: "test_user_id",
        chainId: 1337,
      });
      expect(userEntity).toMatchObject({
        displayName: "test_name",
        sub: "test_user_id",
      });
    });
  });
});
