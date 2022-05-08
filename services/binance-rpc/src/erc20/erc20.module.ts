import { Module } from "@nestjs/common";

import { Erc20TokenModule } from "./token/token.module";
import { Erc20VestingModule } from "./vesting/vesting.module";
import { Erc20StakingModule } from "./staking/staking.module";

@Module({
  imports: [Erc20TokenModule, Erc20VestingModule, Erc20StakingModule],
})
export class Erc20Module {}
