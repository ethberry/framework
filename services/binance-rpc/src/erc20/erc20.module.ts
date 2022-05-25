import { Module } from "@nestjs/common";

import { Erc20VestingLogModule } from "./vesting-logs/vesting-log.module";
import { Erc20VestingModule } from "./vesting/vesting.module";
import { Erc20StakingModule } from "./staking/staking.module";
import { Erc20TokenModule } from "./token/token.module";
import { Erc20LogModule } from "./logs/log.module";

@Module({
  imports: [Erc20TokenModule, Erc20VestingModule, Erc20StakingModule, Erc20LogModule, Erc20VestingLogModule],
})
export class Erc20Module {}
