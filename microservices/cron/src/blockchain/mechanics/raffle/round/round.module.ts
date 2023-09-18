import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { coreEthServiceProvider } from "../../../../common/providers";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { RoundControllerRmq } from "./round.controller.rmq";
import { RaffleRoundServiceRmq } from "./round.service.rmq";

@Module({
  imports: [ConfigModule, ContractModule],
  controllers: [RoundControllerRmq],
  providers: [Logger, coreEthServiceProvider, RaffleRoundServiceRmq],
  exports: [RaffleRoundServiceRmq],
})
export class RaffleRoundModule {}
