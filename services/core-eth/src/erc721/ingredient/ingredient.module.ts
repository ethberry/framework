import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721IngredientEntity } from "./ingredient.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Erc721IngredientEntity])],
})
export class Erc721IngredientModule {}
