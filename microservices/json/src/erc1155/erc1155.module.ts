import { Module } from "@nestjs/common";

import { Erc1155TokenModule } from "./token/token.module";
import { Erc1155CollectionModule } from "./collection/collection.module";

@Module({
  imports: [Erc1155CollectionModule, Erc1155TokenModule],
})
export class Erc1155Module {}
