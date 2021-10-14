import { Test } from "@nestjs/testing";
import { Logger } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { generateUserCreateDto } from "../common/test";
import { DatabaseModule } from "../database/database.module";
import { UserService } from "./user.service";
import { UserSeedModule } from "./user.seed.module";
import { UserSeedService } from "./user.seed.service";
import { UserEntity } from "./user.entity";
import { emlServiceProvider } from "../common/providers";
import { TokenModule } from "../token/token.module";

describe("UserService", () => {
  let userService: UserService;
  let userSeedService: UserSeedService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `.env.${process.env.NODE_ENV as string}`,
        }),
        DatabaseModule,
        TypeOrmModule.forFeature([UserEntity]),
        UserSeedModule,
        TokenModule,
      ],
      providers: [Logger, UserService, UserSeedService, emlServiceProvider],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userSeedService = moduleRef.get<UserSeedService>(UserSeedService);
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
  // describe("update", () => {
  //   it("should update email", async () => {
  //     const entities = await userSeedService.setup();
  //     const email = `trejgun+${v4()}@gmail.com`;
  //     const userEntity = await userService.update({ id: entities.users[0].id }, { email });
  //     expect(userEntity.email).toEqual(email);
  //     expect(userEntity.userStatus).toEqual(UserStatus.PENDING);
  //   });
  // });
});
