import { Module } from "@nestjs/common";

import { ClaimModule } from "./claim/claim.module";
import { GradeModule } from "./grade/grade.module";
import { RecipesModule } from "./recipes/recipes.module";
import { WaitListModule } from "./wait-list/waitlist.module";

@Module({
  imports: [ClaimModule, GradeModule, RecipesModule, WaitListModule],
})
export class MechanicsModule {}
