import { Module } from "@nestjs/common";

import { Erc20ContractModule } from "./contract/contract.module";
import { Erc20VestingModule } from "./vesting/vesting.module";

@Module({
  imports: [Erc20ContractModule, Erc20VestingModule],
})
export class Erc20Module {}
