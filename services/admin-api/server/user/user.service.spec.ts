import {Test, TestingModule} from "@nestjs/testing";
import {Logger} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";

import {UserService} from "./user.service";
import {UserEntity} from "./user.entity";
import {TokenModule} from "../token/token.module";
import {DatabaseModule} from "../database/database.module";

describe("UserService", () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `.env.${process.env.NODE_ENV as string}`,
        }),
        DatabaseModule,
        TypeOrmModule.forFeature([UserEntity]),
        TokenModule,
      ],
      providers: [Logger, UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should generate password hash", () => {
    const hash = service.createPasswordHash("My5up3r5tr0ngP@55w0rd");
    expect(hash).toEqual("92f357f4a898825de204b25fffec4a0a1ca486ad1e25643502e33b5ebeefc3ff");
  });
});
