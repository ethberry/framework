import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998IngredientEntity } from "./ingredient.entity";
import { IngredientService } from "./ingredient.service";

@Module({
  imports: [TypeOrmModule.forFeature([Erc998IngredientEntity])],
  providers: [IngredientService],
  exports: [IngredientService],
})
export class Erc998IngredientModule {}
