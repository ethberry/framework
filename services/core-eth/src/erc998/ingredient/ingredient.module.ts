import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998IngredientEntity } from "./ingredient.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Erc998IngredientEntity])],
})
export class Erc998IngredientModule {}
