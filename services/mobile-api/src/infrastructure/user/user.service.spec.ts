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

  afterEach(async () => {
    await userSeedService.tearDown();
  });

  describe("findOne", () => {
    it("should find user", async () => {
      const entities = await userSeedService.setup();
      const userEntity = await userService.findOne({ id: entities.users[0].id });
      expect(userEntity?.email).toEqual(entities.users[0].email);
    });
  });
});
