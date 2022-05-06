import { Module } from "@nestjs/common";

import { Erc721CollectionModule } from "./collection/collection.module";
import { Erc721TemplateModule } from "./template/template.module";
import { Erc721DropboxModule } from "./dropbox/dropbox.module";
import { Erc721AirdropModule } from "./airdrop/airdrop.module";
import { Erc721TokenModule } from "./token/token.module";
import { Erc721AuctionModule } from "./auction/auction.module";

@Module({
  imports: [
    Erc721CollectionModule,
    Erc721TemplateModule,
    Erc721DropboxModule,
    Erc721AirdropModule,
    Erc721TokenModule,
    Erc721AuctionModule,
  ],
})
export class Erc721Module {}
