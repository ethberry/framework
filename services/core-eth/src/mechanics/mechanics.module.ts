import { Module } from "@nestjs/common";

import { AirdropModule } from "./airdrop/airdrop.module";
import { LootboxModule } from "./lootbox/lootbox.module";
import { ExchangeModule } from "./exchange/exchange.module";
import { StakingModule } from "./staking/staking.module";
import { VestingModule } from "./vesting/vesting.module";

@Module({
  imports: [AirdropModule, LootboxModule, ExchangeModule, StakingModule, VestingModule],
})
export class MechanicsModule {}
