import { Module } from "@nestjs/common";

import { Erc721CollectionModule } from "./collection/collection.module";
import { Erc721TokenModule } from "./token/token.module";
import { Erc721TemplateModule } from "./template/template.module";
import { Erc721MarketplaceModule } from "./marketplace/marketplace.module";
import { Erc721AirdropModule } from "./airdrop/airdrop.module";
import { Erc721DropboxModule } from "./dropbox/dropbox.module";
import { Erc721RecipeModule } from "./recipe/recipe.module";
import { Erc721MarketplaceLogModule } from "./eth-log/erc721-marketplace-log/erc721-marketplace.log.module";
import { Erc721CraftLogModule } from "./eth-log/erc721-craft-log/erc721-craft.log.module";
import { Erc721DropboxLogModule } from "./eth-log/erc721-dropbox-log/erc721-dropbox.log.module";
import { Erc721AirdropLogModule } from "./eth-log/erc721-airdrop-log/erc721-airdrop.log.module";

@Module({
  imports: [
    Erc721AirdropLogModule,
    Erc721AirdropModule,
    Erc721CollectionModule,
    Erc721CraftLogModule,
    Erc721DropboxLogModule,
    Erc721DropboxModule,
    Erc721MarketplaceLogModule,
    Erc721MarketplaceModule,
    Erc721RecipeModule,
    Erc721TemplateModule,
    Erc721TokenModule,
  ],
})
export class Erc721Module {}
