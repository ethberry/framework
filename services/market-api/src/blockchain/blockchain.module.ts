import { Module } from "@nestjs/common";

import { StakingModule } from "./staking/staking.module";

@Module({
  imports: [StakingModule],
})
export class BlockchainModule {}
