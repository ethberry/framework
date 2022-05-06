import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc1155RecipeHistoryModule } from "../recipe-history/recipe-history.module";
import { Erc1155RecipeService } from "./recipe.service";
import { Erc1155RecipeEntity } from "./recipe.entity";
import { Erc1155RecipeServiceWs } from "./recipe.service.ws";
import { Erc1155ControllerWs } from "./recipe.controller.ws";
import { Erc1155RecipeHistoryEntity } from "../recipe-history/recipe-history.entity";

@Module({
  imports: [
    Erc1155RecipeHistoryModule,
    TypeOrmModule.forFeature([Erc1155RecipeEntity]),
    TypeOrmModule.forFeature([Erc1155RecipeHistoryEntity]),
  ],
  providers: [Logger, Erc1155RecipeService, Erc1155RecipeServiceWs],
  controllers: [Erc1155ControllerWs],
  exports: [Erc1155RecipeService, Erc1155RecipeServiceWs],
})
export class Erc1155RecipeModule {}
