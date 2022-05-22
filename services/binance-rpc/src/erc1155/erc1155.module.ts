import { Module } from "@nestjs/common";

import { Erc1155CollectionModule } from "./collection/collection.module";
import { Erc1155TokenModule } from "./token/token.module";
import { Erc1155BalanceModule } from "./balance/balance.module";
import { Erc1155MarketplaceModule } from "./marketplace/marketplace.module";
import { Erc1155RecipeModule } from "./recipe/recipe.module";
import { Erc1155LogModule } from "./logs/log.module";

@Module({
  imports: [
    Erc1155CollectionModule,
    Erc1155TokenModule,
    Erc1155BalanceModule,
    Erc1155RecipeModule,
    Erc1155MarketplaceModule,
    Erc1155LogModule,
  ],
})
export class Erc1155Module {}
