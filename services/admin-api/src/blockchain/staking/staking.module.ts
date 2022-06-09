import { Module } from "@nestjs/common";

import { StakingHistoryModule } from "../staking-history/staking-history.module";

@Module({
  imports: [StakingHistoryModule],
})
export class StakingModule {}
