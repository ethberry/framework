import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Logger } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { GemunionTypeormModule } from "@gemunion/nest-js-module-typeorm-debug";

import { UserEntity } from "../user/user.entity";
import { EventService } from "./event.service";
import ormconfig from "../ormconfig";

describe("EventService", () => {
  let eventService: EventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `.env.${process.env.NODE_ENV as string}`,
        }),
        GemunionTypeormModule.forRoot(ormconfig),
        TypeOrmModule.forFeature([UserEntity]),
      ],
      providers: [Logger, EventService],
    }).compile();

    eventService = module.get<EventService>(EventService);
  });

  it("should be defined", () => {
    expect(eventService).toBeDefined();
  });
});
