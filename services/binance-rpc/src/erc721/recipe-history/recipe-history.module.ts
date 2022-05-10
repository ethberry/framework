import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721RecipeHistoryEntity } from "./recipe-history.entity";
import { Erc721RecipeHistoryService } from "./recipe-history.service";

@Module({
  imports: [TypeOrmModule.forFeature([Erc721RecipeHistoryEntity])],
  providers: [Erc721RecipeHistoryService],
  exports: [Erc721RecipeHistoryService],
})
export class Erc721RecipeHistoryModule {}
