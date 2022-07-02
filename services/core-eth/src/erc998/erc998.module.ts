import { Module } from "@nestjs/common";

import { Erc998TokenModule } from "./token/token.module";
import { Erc998MarketplaceModule } from "./marketplace/marketplace.module";

@Module({
  imports: [Erc998MarketplaceModule, Erc998TokenModule],
})
export class Erc998Module {}
