import { Module } from "@nestjs/common";

import { Erc721CollectionModule } from "./collection/collection.module";
import { Erc721TemplateModule } from "./template/template.module";
import { Erc721AirdropModule } from "./airdrop/airdrop.module";
import { Erc721DropboxModule } from "./dropbox/dropbox.module";
import { Erc721TokenModule } from "./token/token.module";
import { Erc721TokenHistoryModule } from "./token-history/token-history.module";
import { Erc721AuctionModule } from "./auction/auction.module";
import { Erc721AuctionHistoryModule } from "./auction-history/auction-history.module";
import { Erc721MarketplaceModule } from "./marketplace/marketplace.module";

@Module({
  imports: [
    Erc721CollectionModule,
    Erc721TemplateModule,
    Erc721DropboxModule,
    Erc721AirdropModule,
    Erc721TokenModule,
    Erc721TokenHistoryModule,
    Erc721AuctionModule,
    Erc721AuctionHistoryModule,
    Erc721MarketplaceModule,
  ],
})
export class Erc721Module {}
