import { Module } from "@nestjs/common";

import { CraftModule } from "./craft/craft.module";
import { DismantleModule } from "./dismantle/dismantle.module";

@Module({
  imports: [CraftModule, DismantleModule],
})
export class RecipesModule {}
