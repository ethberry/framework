import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721RecipeHistoryModule } from "../recipe-history/recipe-history.module";
import { Erc721RecipeService } from "./recipe.service";
import { Erc721RecipeEntity } from "./recipe.entity";
import { Erc721RecipeServiceWs } from "./recipe.service.ws";
import { Erc721ControllerWs } from "./recipe.controller.ws";
import { Erc721RecipeHistoryEntity } from "../recipe-history/recipe-history.entity";

@Module({
  imports: [
    Erc721RecipeHistoryModule,
    TypeOrmModule.forFeature([Erc721RecipeEntity]),
    TypeOrmModule.forFeature([Erc721RecipeHistoryEntity]),
  ],
  providers: [Logger, Erc721RecipeService, Erc721RecipeServiceWs],
  controllers: [Erc721ControllerWs],
  exports: [Erc721RecipeService, Erc721RecipeServiceWs],
})
export class Erc721RecipeModule {}
