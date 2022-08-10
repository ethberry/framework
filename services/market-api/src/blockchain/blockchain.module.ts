import { Module } from "@nestjs/common";

import { HierarchyModule } from "./hierarchy/hierarchy.module";
import { TokensModule } from "./tokens/tokens.module";
import { MechanicsModule } from "./mechanics/mechanics.module";

@Module({
  imports: [HierarchyModule, TokensModule, MechanicsModule],
})
export class BlockchainModule {}
