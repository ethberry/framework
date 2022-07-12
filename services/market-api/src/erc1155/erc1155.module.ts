import { Module } from "@nestjs/common";

import { Erc1155ContractModule } from "./contract/contract.module";
import { Erc1155TemplateModule } from "./template/template.module";
import { Erc1155TokenModule } from "./token/token.module";
import { Erc1155BalanceModule } from "./balance/balance.module";

@Module({
  imports: [Erc1155ContractModule, Erc1155TemplateModule, Erc1155TokenModule, Erc1155BalanceModule],
})
export class Erc1155Module {}
