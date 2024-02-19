import { Module } from "@nestjs/common";

import { BreedModule } from "./breed/breed.module";
import { GradeModule } from "./grade/grade.module";
import { RentModule } from "./rent/rent.module";
import { RecipesModule } from "./recipes/recipes.module";

@Module({
  imports: [RecipesModule, BreedModule, GradeModule, RentModule],
})
export class GamingMechanicsModule {}
