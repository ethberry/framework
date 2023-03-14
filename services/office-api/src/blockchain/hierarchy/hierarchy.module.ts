import { Module } from "@nestjs/common";

import { ContractModule } from "./contract/contract.module";
import { TokenModule } from "./token/token.module";
import { TemplateModule } from "./template/template.module";

@Module({
  imports: [ContractModule, TemplateModule, TokenModule],
})
export class HierarchyModule {}
