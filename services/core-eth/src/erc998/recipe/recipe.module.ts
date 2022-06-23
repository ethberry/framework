import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998RecipeService } from "./recipe.service";
import { Erc998RecipeEntity } from "./recipe.entity";
import { Erc998RecipeServiceEth } from "./recipe.service.eth";
import { Erc998ControllerEth } from "./recipe.controller.eth";
import { Erc998RecipeHistoryModule } from "./recipe-history/recipe-history.module";
import { Erc998RecipeLogModule } from "./recipe-log/recipe-log.module";
import { ContractManagerModule } from "../../blockchain/contract-manager/contract-manager.module";

@Module({
  imports: [
    ContractManagerModule,
    Erc998RecipeHistoryModule,
    Erc998RecipeLogModule,
    TypeOrmModule.forFeature([Erc998RecipeEntity]),
  ],
  providers: [Logger, Erc998RecipeService, Erc998RecipeServiceEth],
  controllers: [Erc998ControllerEth],
  exports: [Erc998RecipeService, Erc998RecipeServiceEth],
})
export class Erc998RecipeModule {}
