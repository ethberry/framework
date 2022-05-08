import { Module } from "@nestjs/common";

import { Erc20StakingHistoryModule } from "../staking-history/staking-history.module";

@Module({
  imports: [Erc20StakingHistoryModule],
})
export class Erc20StakingModule {}
