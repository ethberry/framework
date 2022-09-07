import { Module } from "@nestjs/common";

import { Erc1155TokenModule } from "./token/token.module";

@Module({
  imports: [Erc1155TokenModule],
})
export class Erc1155Module {}
