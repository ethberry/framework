import { Module } from "@nestjs/common";

import { Erc1155TokenHistoryModule } from "./token-history/token-history.module";

@Module({
  imports: [Erc1155TokenHistoryModule],
})
export class Erc1155TokenModule {}
