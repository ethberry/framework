import { Module } from "@nestjs/common";

import { BreedModule } from "./breed/breed.module";
import { CollectionModule } from "./collection/collection.module";
import { DiscreteModule } from "./discrete/discrete.module";
import { RecipesModule } from "./recipes/recipes.module";
import { RentableModule } from "./rentable/rentable.module";

@Module({
  imports: [BreedModule, CollectionModule, DiscreteModule, RecipesModule, RentableModule],
})
export class GamingMechanicsModule {}
