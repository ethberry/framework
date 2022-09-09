import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import type { IInfuraOptions } from "@gemunion/nest-js-module-infura-firebase";
import { InfuraFirebaseModule } from "@gemunion/nest-js-module-infura-firebase";

import { InfuraService } from "./infura.service";
import { InfuraController } from "./infura.controller";
import { TokenModule } from "../../hierarchy/token/token.module";

@Module({
  imports: [
    TokenModule,
    InfuraFirebaseModule.forRootAsync(InfuraFirebaseModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): IInfuraOptions => {
        const infuraId = configService.get<string>("INFURA_ID", "");
        const infuraSecretKey = configService.get<string>("INFURA_SECRET_KEY", "");
        return {
          host: "ipfs.infura.io",
          port: 5001,
          protocol: "https",
          headers: {
            authorization: "Basic " + Buffer.from(infuraId + ":" + infuraSecretKey).toString("base64"),
          },
        };
      },
    }),
  ],
  providers: [InfuraService],
  controllers: [InfuraController],
  exports: [InfuraService],
})
export class InfuraModule {}
