import { Module } from "@nestjs/common";

import { AirdropModule } from "./airdrop/airdrop.module";
import { DropboxModule } from "./dropbox/dropbox.module";
import { StakingModule } from "./staking/staking.module";
import { VestingModule } from "./vesting/vesting.module";
import { CraftModule } from "./craft/craft.module";
import { MarketplaceModule } from "./marketplace/marketplace.module";
import { GradeModule } from "./grade/grade.module";

@Module({
  imports: [AirdropModule, DropboxModule, CraftModule, StakingModule, VestingModule, MarketplaceModule, GradeModule],
})
export class MechanicsModule {}
