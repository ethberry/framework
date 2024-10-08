import { Module } from "@nestjs/common";

import { Erc20Module } from "./erc20/erc20.module";
import { Erc721Module } from "./erc721/erc721.module";
import { Erc998Module } from "./erc998/erc998.module";
import { Erc1155Module } from "./erc1155/erc1155.module";
import { Erc1363Module } from "./erc1363/erc1363.module";

@Module({
  imports: [Erc20Module, Erc721Module, Erc998Module, Erc1155Module, Erc1363Module],
})
export class TokensModule {}
