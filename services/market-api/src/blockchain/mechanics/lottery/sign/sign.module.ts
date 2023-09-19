import { Logger, Module } from "@nestjs/common";

import { SignerModule } from "@framework/nest-js-module-exchange-signer";

import { LotterySignController } from "./sign.controller";
import { LotterySignService } from "./sign.service";
import { LotteryRoundModule } from "../round/round.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";

@Module({
  imports: [ContractModule, LotteryRoundModule, SignerModule],
  providers: [Logger, LotterySignService],
  controllers: [LotterySignController],
  exports: [LotterySignService],
})
export class LotterySignModule {}
