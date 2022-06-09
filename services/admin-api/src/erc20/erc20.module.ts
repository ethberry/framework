import { Module } from "@nestjs/common";

import { Erc20TokenModule } from "./token/token.module";
import { Erc20VestingModule } from "./vesting/vesting.module";

@Module({
  imports: [Erc20TokenModule, Erc20VestingModule],
})
export class Erc20Module {}
