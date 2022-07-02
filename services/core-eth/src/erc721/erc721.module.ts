import { Module } from "@nestjs/common";

import { Erc721TokenModule } from "./token/token.module";
import { Erc721MarketplaceModule } from "./marketplace/marketplace.module";
import { AirdropModule } from "../mechanics/airdrop/airdrop.module";

@Module({
  imports: [AirdropModule, Erc721MarketplaceModule, Erc721TokenModule],
})
export class Erc721Module {}
