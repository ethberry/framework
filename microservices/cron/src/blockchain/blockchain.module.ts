import { Module } from "@nestjs/common";

import { HierarchyModule } from "./hierarchy/hierarchy.module";
import { MechanicsModule } from "./mechanics/mechanics.module";

@Module({
  imports: [HierarchyModule, MechanicsModule],
})
export class BlockchainModule {}
