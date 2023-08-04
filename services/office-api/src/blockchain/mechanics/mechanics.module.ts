import { Module } from "@nestjs/common";

import { ClaimModule } from "./claim/claim.module";
import { DropModule } from "./drop/drop.module";
import { PyramidModule } from "./pyramid/pyramid.module";
import { StakingModule } from "./staking/staking.module";
import { VestingModule } from "./vesting/vesting.module";

@Module({
  imports: [ClaimModule, DropModule, StakingModule, PyramidModule, VestingModule],
})
export class MechanicsModule {}
