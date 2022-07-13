import { Module } from "@nestjs/common";

import { AirdropModule } from "./airdrop/airdrop.module";
import { DropboxModule } from "./dropbox/dropbox.module";
import { ExchangeModule } from "./exchange/exchange.module";
import { StakingModule } from "./staking/staking.module";
import { VestingModule } from "./vesting/vesting.module";
import { MarketplaceModule } from "./marketplace/marketplace.module";
import { LootModule } from "../../../../microservices/game/src/mechanics/loot/loot.module";

@Module({
  imports: [AirdropModule, DropboxModule, ExchangeModule, StakingModule, VestingModule, MarketplaceModule, LootModule],
})
export class MechanicsModule {}
