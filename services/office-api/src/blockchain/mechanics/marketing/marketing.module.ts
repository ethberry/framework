import { Module } from "@nestjs/common";

import { ClaimModule } from "./claim/claim.module";
import { MysteryModule } from "./mystery/mystery.module";
import { StakingModule } from "./staking/staking.module";
import { LegacyVestingModule } from "./legacy-vesting/legacy-vesting.module";
import { WaitListModule } from "./wait-list/wait-list.module";

@Module({
  imports: [ClaimModule, MysteryModule, StakingModule, LegacyVestingModule, WaitListModule],
})
export class MarketingMechanicsModule {}
