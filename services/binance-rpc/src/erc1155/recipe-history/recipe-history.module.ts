import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc1155RecipeHistoryEntity } from "./recipe-history.entity";
import { Erc1155RecipeHistoryService } from "./recipe-history.service";

@Module({
  imports: [TypeOrmModule.forFeature([Erc1155RecipeHistoryEntity])],
  providers: [Erc1155RecipeHistoryService],
  exports: [Erc1155RecipeHistoryService],
})
export class Erc1155RecipeHistoryModule {}
