import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RecipeService } from "./recipe.service";
import { Erc998RecipeEntity } from "./recipe.entity";
import { RecipeController } from "./recipe.controller";
import { Erc998IngredientModule } from "./ingredient/ingredient.module";

@Module({
  imports: [Erc998IngredientModule, TypeOrmModule.forFeature([Erc998RecipeEntity])],
  providers: [RecipeService],
  controllers: [RecipeController],
  exports: [RecipeService],
})
export class Erc998RecipeModule {}
