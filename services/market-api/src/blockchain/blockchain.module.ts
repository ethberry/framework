import { Module } from "@nestjs/common";

import { HierarchyModule } from "./hierarchy/hierarchy.module";

@Module({
  imports: [HierarchyModule],
})
export class BlockchainModule {}
