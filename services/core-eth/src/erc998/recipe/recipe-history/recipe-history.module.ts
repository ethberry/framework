import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998RecipeHistoryEntity } from "./recipe-history.entity";
import { Erc998RecipeHistoryService } from "./recipe-history.service";

@Module({
  imports: [TypeOrmModule.forFeature([Erc998RecipeHistoryEntity])],
  providers: [Erc998RecipeHistoryService],
  exports: [Erc998RecipeHistoryService],
})
export class Erc998RecipeHistoryModule {}
