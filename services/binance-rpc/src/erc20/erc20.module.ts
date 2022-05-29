import { Module } from "@nestjs/common";

import { Erc20StakingModule } from "./staking/staking.module";
import { Erc20TokenModule } from "./token/token.module";
import { Erc20LogModule } from "./logs/log.module";

// todo move out staking for Log's sake
@Module({
  imports: [Erc20TokenModule, Erc20StakingModule, Erc20LogModule],
})
export class Erc20Module {}
