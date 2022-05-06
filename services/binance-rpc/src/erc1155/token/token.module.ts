import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Erc1155TokenControllerWs } from "./token.controller.ws";
import { Erc1155TokenServiceWs } from "./token.service.ws";
import { Erc1155TokenService } from "./token.service";
import { Erc1155TokenHistoryModule } from "../token-history/token-history.module";
import { Erc1155RecipeModule } from "../recipe/recipe.module";
import { Erc1155TokenEntity } from "./token.entity";
import { Erc1155CollectionModule } from "../collection/collection.module";
import { Erc1155BalanceModule } from "../balance/balance.module";

@Module({
  imports: [
    Erc1155TokenHistoryModule,
    Erc1155TokenModule,
    Erc1155RecipeModule,
    Erc1155CollectionModule,
    Erc1155BalanceModule,
    TypeOrmModule.forFeature([Erc1155TokenEntity]),
  ],
  providers: [Logger, Erc1155TokenService, Erc1155TokenServiceWs],
  controllers: [Erc1155TokenControllerWs],
  exports: [Erc1155TokenService, Erc1155TokenServiceWs],
})
export class Erc1155TokenModule {}
