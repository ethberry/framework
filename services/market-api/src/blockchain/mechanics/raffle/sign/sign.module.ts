import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { SignerModule } from "@framework/nest-js-module-exchange-signer";

import { RaffleSignController } from "./sign.controller";
import { RaffleSignService } from "./sign.service";
import { RaffleRoundModule } from "../round/round.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";

@Module({
  imports: [ConfigModule, RaffleRoundModule, ContractModule, SignerModule],
  providers: [Logger, RaffleSignService],
  controllers: [RaffleSignController],
  exports: [RaffleSignService],
})
export class RaffleSignModule {}
