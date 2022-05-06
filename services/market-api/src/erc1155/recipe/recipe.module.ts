import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RecipeService } from "./recipe.service";
import { Erc1155RecipeEntity } from "./recipe.entity";
import { RecipeController } from "./recipe.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Erc1155RecipeEntity])],
  providers: [RecipeService],
  controllers: [RecipeController],
  exports: [RecipeService],
})
export class Erc1155RecipeModule {}
