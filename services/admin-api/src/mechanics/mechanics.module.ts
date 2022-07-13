import { Module } from "@nestjs/common";

import { AirdropModule } from "./airdrop/airdrop.module";
import { DropboxModule } from "./dropbox/dropbox.module";
import { CraftModule } from "./craft/craft.module";
import { StakingModule } from "./staking/staking.module";
import { VestingModule } from "./vesting/vesting.module";

@Module({
  imports: [AirdropModule, DropboxModule, CraftModule, StakingModule, VestingModule],
})
export class MechanicsModule {}
