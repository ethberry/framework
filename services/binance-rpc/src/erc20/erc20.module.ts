import { Module } from "@nestjs/common";

import { Erc20StakingModule } from "./staking/staking.module";
import { Erc20TokenModule } from "./token/token.module";

// todo move out staking for Log's sake
@Module({
  imports: [Erc20TokenModule, Erc20StakingModule],
})
export class Erc20Module {}
