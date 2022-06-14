import { Module } from "@nestjs/common";

import { Erc998CollectionModule } from "./collection/collection.module";
import { Erc998TemplateModule } from "./template/template.module";
import { Erc998DropboxModule } from "./dropbox/dropbox.module";
import { Erc998AirdropModule } from "./airdrop/airdrop.module";
import { Erc998TokenModule } from "./token/token.module";
import { Erc998RecipeModule } from "./recipe/recipe.module";

@Module({
  imports: [
    Erc998CollectionModule,
    Erc998TemplateModule,
    Erc998DropboxModule,
    Erc998AirdropModule,
    Erc998TokenModule,
    Erc998RecipeModule,
  ],
})
export class Erc998Module {}
