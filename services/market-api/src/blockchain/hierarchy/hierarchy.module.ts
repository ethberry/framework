import { Module } from "@nestjs/common";

import { TemplateModule } from "./template/template.module";
import { ContractModule } from "./contract/contract.module";

@Module({
  imports: [ContractModule, TemplateModule],
})
export class HierarchyModule {}
