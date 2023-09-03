import { Module } from "@nestjs/common";

import { ClaimModule } from "./claim/claim.module";
import { RecipesModule } from "./recipes/recipes.module";
import { WaitListModule } from "./wait-list/waitlist.module";

@Module({
  imports: [ClaimModule, RecipesModule, WaitListModule],
})
export class MechanicsModule {}
