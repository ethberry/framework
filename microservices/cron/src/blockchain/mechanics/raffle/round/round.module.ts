import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { coreEthServiceProviderBesu, coreEthServiceProviderBinance } from "../../../../common/providers";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { RoundControllerRmq } from "./round.controller.rmq";
import { RaffleRoundServiceRmq } from "./round.service.rmq";

@Module({
  imports: [ConfigModule, ContractModule],
  controllers: [RoundControllerRmq],
  providers: [Logger, coreEthServiceProviderBesu, coreEthServiceProviderBinance, RaffleRoundServiceRmq],
  exports: [RaffleRoundServiceRmq],
})
export class RaffleRoundModule implements OnModuleInit {
  constructor(private readonly raffleRoundServiceRmq: RaffleRoundServiceRmq) {}

  // save last block on SIGTERM
  public async onModuleInit(): Promise<void> {
    return this.raffleRoundServiceRmq.initSchedule();
  }
}
