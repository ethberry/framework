import { Module } from "@nestjs/common";

import { Erc20ContractModule } from "./contract/contract.module";

@Module({
  imports: [Erc20ContractModule],
})
export class Erc20Module {}
