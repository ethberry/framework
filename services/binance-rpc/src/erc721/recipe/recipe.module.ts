import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721RecipeHistoryModule } from "../recipe-history/recipe-history.module";
import { Erc721RecipeService } from "./recipe.service";
import { Erc721RecipeEntity } from "./recipe.entity";
import { Erc721RecipeServiceEth } from "./recipe.service.eth";
import { Erc721ControllerEth } from "./recipe.controller.eth";
import { Erc721RecipeHistoryEntity } from "../recipe-history/recipe-history.entity";
import { ContractManagerModule } from "../../blockchain/contract-manager/contract-manager.module";

@Module({
  imports: [
    ContractManagerModule,
    Erc721RecipeHistoryModule,
    TypeOrmModule.forFeature([Erc721RecipeEntity]),
    TypeOrmModule.forFeature([Erc721RecipeHistoryEntity]),
  ],
  providers: [Logger, Erc721RecipeService, Erc721RecipeServiceEth],
  controllers: [Erc721ControllerEth],
  exports: [Erc721RecipeService, Erc721RecipeServiceEth],
})
export class Erc721RecipeModule {}
