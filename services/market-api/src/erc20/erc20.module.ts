import { Module } from "@nestjs/common";

import { Erc20VestingModule } from "./vesting/vesting.module";
import { Erc20TokenModule } from "./token/token.module";

@Module({
  imports: [Erc20VestingModule, Erc20TokenModule],
})
export class Erc20Module {}
