import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { coreEthServiceProviderBesu, coreEthServiceProviderBinance } from "../../../../common/providers";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { RoundControllerRmq } from "./round.controller.rmq";
import { LotteryRoundServiceRmq } from "./round.service.rmq";

@Module({
  imports: [ConfigModule, ContractModule],
  controllers: [RoundControllerRmq],
  providers: [Logger, coreEthServiceProviderBesu, coreEthServiceProviderBinance, LotteryRoundServiceRmq],
  exports: [LotteryRoundServiceRmq],
})
export class LotteryRoundModule implements OnModuleInit {
  constructor(private readonly lotteryRoundServiceRmq: LotteryRoundServiceRmq) {}

  public async onModuleInit(): Promise<void> {
    return this.lotteryRoundServiceRmq.initSchedule();
  }
}
