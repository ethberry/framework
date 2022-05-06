import { Module } from "@nestjs/common";

import { Erc20StakingHistoryModule } from "./staking-history/staking-history.module";
import { Erc20TokenModule } from "./token/token.module";

@Module({
  imports: [Erc20TokenModule, Erc20StakingHistoryModule],
})
export class Erc20Module {}
