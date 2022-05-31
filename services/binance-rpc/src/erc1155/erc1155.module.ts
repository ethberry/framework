import { Module } from "@nestjs/common";

import { Erc1155CollectionModule } from "./collection/collection.module";
import { Erc1155TokenModule } from "./token/token.module";
import { Erc1155BalanceModule } from "./balance/balance.module";
import { Erc1155MarketplaceModule } from "./marketplace/marketplace.module";
import { Erc1155RecipeModule } from "./recipe/recipe.module";
import { Erc1155MarketplaceLogModule } from "./eth-log/erc1155-marketplace-log/erc1155-marketplace.log.module";
import { Erc1155CraftLogModule } from "./eth-log/erc1155-craft-log/erc1155-craft.log.module";

@Module({
  imports: [
    Erc1155MarketplaceLogModule,
    Erc1155CraftLogModule,
    Erc1155CollectionModule,
    Erc1155TokenModule,
    Erc1155BalanceModule,
    Erc1155RecipeModule,
    Erc1155MarketplaceModule,
  ],
})
export class Erc1155Module {}
