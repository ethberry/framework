import { Module } from "@nestjs/common";

import { Erc20TokenModule } from "./token/token.module";
import { Erc20StakingModule } from "./staking/staking.module";

@Module({
  imports: [Erc20TokenModule, Erc20StakingModule],
})
export class Erc20Module {}
