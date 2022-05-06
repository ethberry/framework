import { Module } from "@nestjs/common";

import { Erc1155CollectionModule } from "./collection/collection.module";
import { Erc1155TokenModule } from "./token/token.module";
import { Erc1155RecipeModule } from "./recipe/recipe.module";

@Module({
  imports: [Erc1155CollectionModule, Erc1155TokenModule, Erc1155RecipeModule],
})
export class Erc1155Module {}
