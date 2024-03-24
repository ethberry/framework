import { Module } from "@nestjs/common";

import { BreedModule } from "./breed/breed.module";
import { DiscreteModule } from "./discrete/discrete.module";
import { RentModule } from "./rent/rent.module";
import { RecipesModule } from "./recipes/recipes.module";

@Module({
  imports: [RecipesModule, BreedModule, DiscreteModule, RentModule],
})
export class GamingMechanicsModule {}
