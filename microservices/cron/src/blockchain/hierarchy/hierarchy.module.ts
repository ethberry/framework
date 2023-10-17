import { Module } from "@nestjs/common";

import { ContractModule } from "./contract/contract.module";

@Module({
  imports: [ContractModule],
})
export class HierarchyModule {}
