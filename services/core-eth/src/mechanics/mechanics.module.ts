import { Module } from "@nestjs/common";

import { AirdropModule } from "./airdrop/airdrop.module";
import { DropboxModule } from "./dropbox/dropbox.module";
import { ExchangeModule } from "./exchange/exchange.module";
import { StakingModule } from "./staking/staking.module";
import { VestingModule } from "./vesting/vesting.module";
import { MarketplaceModule } from "./marketplace/marketplace.module";

@Module({
  imports: [AirdropModule, DropboxModule, ExchangeModule, MarketplaceModule, StakingModule, VestingModule],
})
export class MechanicsModule {}
