import { Module } from "@nestjs/common";

import { LotterySignModule } from "./sign/sign.module";
import { LotteryRoundModule } from "./round/round.module";
import { LotteryTokenModule } from "./token/token.module";
import { LotteryContractModule } from "./contract/lottery.module";

@Module({
  imports: [LotteryContractModule, LotteryRoundModule, LotteryTokenModule, LotterySignModule],
})
export class LotteryModule {}
