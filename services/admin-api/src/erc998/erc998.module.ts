import { Module } from "@nestjs/common";

import { Erc998ContractModule } from "./contract/contract.module";
import { Erc998TemplateModule } from "./template/template.module";
import { Erc998TokenModule } from "./token/token.module";

@Module({
  imports: [
    Erc998ContractModule,
    Erc998TemplateModule,
    Erc998TokenModule,
  ],
})
export class Erc998Module {}
