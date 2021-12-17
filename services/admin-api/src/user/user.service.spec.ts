import { Test } from "@nestjs/testing";
import { Logger } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { v4 } from "uuid";

import { TokenType } from "@gemunion/framework-types";
import { GemunionTypeormModule } from "@gemunion/nest-js-module-typeorm";

import { emlServiceProvider } from "../common/providers";
import { generateUserCreateDto } from "../common/test";
import { TokenEntity } from "../token/token.entity";
import { TokenModule } from "../token/token.module";
import { TokenService } from "../token/token.service";
import { UserEntity } from "./user.entity";
import { UserSeedModule } from "./user.seed.module";
import { UserSeedService } from "./user.seed.service";
import { UserService } from "./user.service";
import ormconfig from "../ormconfig";

describe("UserService", () => {
  let userService: UserService;
  let userSeedService: UserSeedService;
  let tokenService: TokenService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `.env.${process.env.NODE_ENV as string}`,
        }),
        GemunionTypeormModule.forRoot(ormconfig),
        TypeOrmModule.forFeature([UserEntity, TokenEntity]),
        UserSeedModule,
        TokenModule,
      ],
      providers: [Logger, UserService, UserSeedService, emlServiceProvider, TokenService],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userSeedService = moduleRef.get<UserSeedService>(UserSeedService);
    tokenService = moduleRef.get<TokenService>(TokenService);
  });

  afterEach(async () => {
    await userSeedService.tearDown();
  });

  describe("createPasswordHash", () => {
    it("should generate password hash", () => {
      const hash = userService.createPasswordHash("My5up3r5tr0ngP@55w0rd");
      expect(hash).toEqual("97a609f782839fa886c8ae797d8d66f4a5138c2b02fb0dcab39ff74b85bc35fe");
    });
  });

  describe("create", () => {
    it("create user (ConflictException lowercase)", async () => {
      const entities = await userSeedService.setup();
      return userService
        .create(generateUserCreateDto({ email: entities.users[0].email }))
        .then(() => fail(new Error()))
        .catch(e => {
          expect(e.status).toEqual(409);
        });
    });

    it("create user", () => {
      return userService.create(generateUserCreateDto());
    });
  });

  // Changed the process of updating the mail address
  describe("update", () => {
    it("should update email", async () => {
      const entities = await userSeedService.setup();
      const oldUserEntity = await userService.findOne({ id: entities.users[0].id });
      const email = `trejgun+${v4()}@gmail.com`;
      const userEntity = await userService.update({ id: entities.users[0].id }, { email });
      expect(userEntity.email).toEqual(oldUserEntity?.email);
      const tokenEntity = await tokenService.findOne({ tokenType: TokenType.EMAIL, user: userEntity });
      expect(tokenEntity).toBeDefined();
      expect(tokenEntity?.data.email).toEqual(email);
    });
  });
});
