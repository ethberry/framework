import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { PinataFirebaseModule } from "@gemunion/nest-js-module-pinata-firebase";
import type { IPinataOptions } from "@gemunion/nest-js-module-pinata-firebase";

import { PinataService } from "./pinata.service";
import { PinataController } from "./pinata.controller";
import { TokenModule } from "../../hierarchy/token/token.module";

@Module({
  imports: [
    TokenModule,
    PinataFirebaseModule.forRootAsync(PinataFirebaseModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): IPinataOptions => {
        const pinataApiKey = configService.get<string>("PINATA_API_KEY", "");
        const pinataApiSecret = configService.get<string>("PINATA_API_SECRET", "");
        return {
          pinataApiKey,
          pinataApiSecret,
        };
      },
    }),
  ],
  providers: [PinataService],
  controllers: [PinataController],
  exports: [PinataService],
})
export class PinataModule {}
