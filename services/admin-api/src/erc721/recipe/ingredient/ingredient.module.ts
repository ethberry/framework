import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721IngredientEntity } from "./ingredient.entity";
import { IngredientService } from "./ingredient.service";

@Module({
  imports: [TypeOrmModule.forFeature([Erc721IngredientEntity])],
  providers: [IngredientService],
  exports: [IngredientService],
})
export class Erc721IngredientModule {}
