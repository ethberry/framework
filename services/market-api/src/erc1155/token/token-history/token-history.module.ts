import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc1155TokenHistoryEntity } from "./token-history.entity";
import { Erc1155TokenHistoryService } from "./token-history.service";
import { Erc1155TokenHistoryController } from "./token-history.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Erc1155TokenHistoryEntity])],
  providers: [Erc1155TokenHistoryService],
  controllers: [Erc1155TokenHistoryController],
  exports: [Erc1155TokenHistoryService],
})
export class Erc1155TokenHistoryModule {}
