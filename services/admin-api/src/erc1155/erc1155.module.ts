import { Module } from "@nestjs/common";

import { Erc1155ContractModule } from "./contract/contract.module";
import { Erc1155TemplateModule } from "./template/template.module";

@Module({
  imports: [Erc1155ContractModule, Erc1155TemplateModule],
})
export class Erc1155Module {}
