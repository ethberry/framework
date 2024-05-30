import { Module } from "@nestjs/common";

import { DiscreteModule } from "./discrete/discrete.module";
import { RecipesModule } from "./recipes/recipes.module";

@Module({
  imports: [RecipesModule, DiscreteModule],
})
export class GamingMechanicsModule {}
