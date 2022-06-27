import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc1155TokenControllerEth } from "./token.controller.eth";
import { Erc1155TokenServiceEth } from "./token.service.eth";
import { Erc1155TokenService } from "./token.service";
import { Erc1155TokenHistoryModule } from "./token-history/token-history.module";
import { Erc1155RecipeModule } from "../recipe/recipe.module";
import { UniTemplateEntity } from "./token.entity";
import { Erc1155CollectionModule } from "../collection/collection.module";
import { Erc1155BalanceModule } from "../balance/balance.module";
import { Erc1155TokenLogModule } from "./token-log/token-log.module";
import { ContractManagerModule } from "../../blockchain/contract-manager/contract-manager.module";
import { AccessControlModule } from "../../blockchain/access-control/access-control.module";

@Module({
  imports: [
    ContractManagerModule,
    Erc1155TokenHistoryModule,
    Erc1155TokenLogModule,
    Erc1155TokenModule,
    Erc1155RecipeModule,
    Erc1155CollectionModule,
    Erc1155BalanceModule,
    AccessControlModule,
    TypeOrmModule.forFeature([UniTemplateEntity]),
  ],
  providers: [Logger, Erc1155TokenService, Erc1155TokenServiceEth],
  controllers: [Erc1155TokenControllerEth],
  exports: [Erc1155TokenService, Erc1155TokenServiceEth],
})
export class Erc1155TokenModule {}
