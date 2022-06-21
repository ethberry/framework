import { Module } from "@nestjs/common";

import { Erc721CollectionModule } from "./collection/collection.module";
import { Erc721TemplateModule } from "./template/template.module";
import { Erc721AirdropModule } from "./airdrop/airdrop.module";
import { Erc721DropboxModule } from "./dropbox/dropbox.module";
import { Erc721TokenModule } from "./token/token.module";
import { Erc721MarketplaceModule } from "./marketplace/marketplace.module";
import { Erc721RecipeModule } from "./recipe/recipe.module";
import { Erc721GradeModule } from "./grade/grade.module";

@Module({
  imports: [
    Erc721CollectionModule,
    Erc721TemplateModule,
    Erc721DropboxModule,
    Erc721AirdropModule,
    Erc721TokenModule,
    Erc721MarketplaceModule,
    Erc721RecipeModule,
    Erc721GradeModule,
  ],
})
export class Erc721Module {}
