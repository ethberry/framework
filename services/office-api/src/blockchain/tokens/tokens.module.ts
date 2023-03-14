import { Module } from "@nestjs/common";

import { Erc20Module } from "./erc20/erc20.module";
import { Erc721Module } from "./erc721/erc721.module";
import { Erc1155Module } from "./erc1155/erc1155.module";
import { NativeModule } from "./native/native.module";

@Module({
  imports: [NativeModule, Erc20Module, Erc721Module, Erc1155Module],
})
export class TokensModule {}
