import { Module } from "@nestjs/common";

import { Erc721Module } from "./erc721/erc721.module";
import { Erc998Module } from "./erc998/erc998.module";
import { Erc1155Module } from "./erc1155/erc1155.module";

@Module({
  imports: [Erc721Module, Erc998Module, Erc1155Module],
})
export class TokensModule {}
