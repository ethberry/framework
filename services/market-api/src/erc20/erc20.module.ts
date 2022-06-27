import { Module } from "@nestjs/common";

import { Erc20VestingModule } from "./vesting/vesting.module";
import { Erc20ContractModule } from "./contract/contract.module";

@Module({
  imports: [Erc20VestingModule, Erc20ContractModule],
})
export class Erc20Module {}
