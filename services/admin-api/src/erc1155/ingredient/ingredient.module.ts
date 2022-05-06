import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc1155IngredientEntity } from "./ingredient.entity";
import { IngredientService } from "./ingredient.service";

@Module({
  imports: [TypeOrmModule.forFeature([Erc1155IngredientEntity])],
  providers: [IngredientService],
  exports: [IngredientService],
})
export class Erc1155IngredientModule {}
