import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Logger } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { GemunionTypeormModule } from "@ethberry/nest-js-module-typeorm-debug";
import { LicenseModule } from "@ethberry/nest-js-module-license";

import ormconfig from "../../ormconfig";
import { UserEntity } from "../../infrastructure/user/user.entity";
import { EventService } from "./event.service";

describe("EventService", () => {
  let eventService: EventService;

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
      ],
      providers: [Logger, EventService],
    }).compile();

    eventService = module.get<EventService>(EventService);
  });

  it("should be defined", () => {
    expect(eventService).toBeDefined();
  });
});
