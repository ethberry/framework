import { Module } from "@nestjs/common";

import { CraftModule } from "./craft/craft.module";
import { DismantleModule } from "./dismantle/dismantle.module";
import { MergeModule } from "./merge/merge.module";

@Module({
  imports: [CraftModule, DismantleModule, MergeModule],
})
export class RecipesModule {}
