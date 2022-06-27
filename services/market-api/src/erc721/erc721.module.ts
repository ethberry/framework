import { Module } from "@nestjs/common";

import { Erc721CollectionModule } from "./contract/contract.module";
import { Erc721TemplateModule } from "./template/template.module";
import { Erc721TokenModule } from "./token/token.module";
import { Erc721MarketplaceModule } from "./marketplace/marketplace.module";
import { Erc721GradeModule } from "../blockchain/grade/grade.module";

@Module({
  imports: [
    Erc721CollectionModule,
    Erc721TemplateModule,
    Erc721TokenModule,
    Erc721MarketplaceModule,
    Erc721GradeModule,
  ],
})
export class Erc721Module {}
