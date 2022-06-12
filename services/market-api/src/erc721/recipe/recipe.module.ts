import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RecipeService } from "./recipe.service";
import { Erc721RecipeEntity } from "./recipe.entity";
import { RecipeController } from "./recipe.controller";
import { Erc721IngredientModule } from "./ingredient/ingredient.module";

@Module({
  imports: [Erc721IngredientModule, TypeOrmModule.forFeature([Erc721RecipeEntity])],
  providers: [RecipeService],
  controllers: [RecipeController],
  exports: [RecipeService],
})
export class Erc721RecipeModule {}
