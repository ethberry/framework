import { Module } from "@nestjs/common";

import { Erc1155TokenModule } from "./token/token.module";
import { Erc1155MarketplaceModule } from "./marketplace/marketplace.module";

@Module({
  imports: [Erc1155TokenModule, Erc1155MarketplaceModule],
})
export class Erc1155Module {}
