import { Module } from "@nestjs/common";

import { Erc1155BalanceModule } from "./balance/balance.module";
import { Erc1155TokenHistoryModule } from "./token-history/token-history.module";
import { Erc1155MarketplaceModule } from "./marketplace/marketplace.module";

@Module({
  imports: [
    Erc1155BalanceModule,
    Erc1155TokenHistoryModule,
    Erc1155MarketplaceModule,
  ],
})
export class Erc1155Module {}
