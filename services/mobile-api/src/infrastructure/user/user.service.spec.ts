import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { GemunionTypeormModule } from "@gemunion/nest-js-module-typeorm-debug";
import { LicenseModule } from "@gemunion/nest-js-module-license";

import ormconfig from "../../ormconfig";
import { UserService } from "./user.service";
import { UserEntity } from "./user.entity";
import { AuthModule } from "../auth/auth.module";
import { UserSeedModule } from "./user.seed.module";
import { UserSeedService } from "./user.seed.service";
import { EnabledLanguages, testChainId } from "@framework/constants";
import { UserRole, UserStatus } from "@framework/types";

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
        AuthModule,
        UserSeedModule,
      ],
      providers: [Logger, UserService, UserSeedService],
    }).compile();

    userService = module.get<UserService>(UserService);
    userSeedService = module.get<UserSeedService>(UserSeedService);
  });

  describe("findOne", () => {
    it("should find user", async () => {
      const entities = await userSeedService.setup();
      const userEntity = await userService.findOne({ id: entities.users[0].id });
      expect(userEntity?.email).toEqual(entities.users[0].email);
    });
  });

  describe("import", () => {
    it("should create with empty balance", async () => {
      const userEntity = await userService.import({
        displayName: "test_name",
        language: EnabledLanguages.EN,
        imageUrl: "test_url",
        userRoles: [UserRole.CUSTOMER],
        userStatus: UserStatus.ACTIVE,
        sub: "test_user_id",
        chainId: testChainId,
      });
      expect(userEntity).toMatchObject({
        displayName: "test_name",
        sub: "test_user_id",
      });
    });
  });
});
