import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721TokenHistoryEntity } from "./token-history.entity";
import { Erc721TokenHistoryService } from "./token-history.service";
import { Erc721TokenHistoryController } from "./token-history.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Erc721TokenHistoryEntity])],
  providers: [Erc721TokenHistoryService],
  controllers: [Erc721TokenHistoryController],
  exports: [Erc721TokenHistoryService],
})
export class Erc721TokenHistoryModule {}
