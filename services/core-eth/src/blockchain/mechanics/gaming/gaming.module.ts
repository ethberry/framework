import { Module } from "@nestjs/common";

import { BreedModule } from "./breed/breed.module";
import { DiscreteModule } from "./discrete/discrete.module";
import { RecipesModule } from "./recipes/recipes.module";
import { RentableModule } from "./rentable/rentable.module";

@Module({
  imports: [RecipesModule, BreedModule, DiscreteModule, RentableModule],
})
export class GamingMechanicsModule {}
