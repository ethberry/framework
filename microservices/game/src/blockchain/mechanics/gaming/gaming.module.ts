import { Module } from "@nestjs/common";

import { GradeModule } from "./grade/grade.module";
import { RecipesModule } from "./recipes/recipes.module";

@Module({
  imports: [RecipesModule, GradeModule],
})
export class GamingMechanicsModule {}
