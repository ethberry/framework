import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc1155IngredientEntity } from "./ingredient.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Erc1155IngredientEntity])],
})
export class Erc1155IngredientModule {}
