import { Module } from "@nestjs/common";

import { Erc20StakingModule } from "./staking/staking.module";
import { Erc20TokenModule } from "./token/token.module";

@Module({
  imports: [Erc20TokenModule, Erc20StakingModule],
})
export class Erc20Module {}
