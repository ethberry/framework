import { Module } from "@nestjs/common";

import { AirdropModule } from "./airdrop/airdrop.module";
import { DropboxModule } from "./dropbox/dropbox.module";
import { ExchangeModule } from "./exchange/exchange.module";
import { StakingModule } from "./staking/staking.module";

@Module({
  imports: [AirdropModule, DropboxModule, ExchangeModule, StakingModule],
})
export class MechanicsModule {}
