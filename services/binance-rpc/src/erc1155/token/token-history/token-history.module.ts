import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc1155TokenHistoryEntity } from "./token-history.entity";
import { Erc1155TokenHistoryService } from "./token-history.service";

@Module({
  imports: [TypeOrmModule.forFeature([Erc1155TokenHistoryEntity])],
  providers: [Erc1155TokenHistoryService],
  exports: [Erc1155TokenHistoryService],
})
export class Erc1155TokenHistoryModule {}
