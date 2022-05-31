import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractManagerModule } from "../../blockchain/contract-manager/contract-manager.module";
import { Erc1155RecipeHistoryModule } from "../recipe-history/recipe-history.module";
import { Erc1155RecipeService } from "./recipe.service";
import { Erc1155RecipeEntity } from "./recipe.entity";
import { Erc1155RecipeServiceEth } from "./recipe.service.eth";
import { Erc1155ControllerEth } from "./recipe.controller.eth";
import { Erc1155RecipeHistoryEntity } from "../recipe-history/recipe-history.entity";

@Module({
  imports: [
    ContractManagerModule,
    Erc1155RecipeHistoryModule,
    TypeOrmModule.forFeature([Erc1155RecipeEntity]),
    TypeOrmModule.forFeature([Erc1155RecipeHistoryEntity]),
  ],
  providers: [Logger, Erc1155RecipeService, Erc1155RecipeServiceEth],
  controllers: [Erc1155ControllerEth],
  exports: [Erc1155RecipeService, Erc1155RecipeServiceEth],
})
export class Erc1155RecipeModule {}
