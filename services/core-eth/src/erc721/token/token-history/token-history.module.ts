import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721TokenHistoryEntity } from "./token-history.entity";
import { Erc721TokenHistoryService } from "./token-history.service";

@Module({
  imports: [TypeOrmModule.forFeature([Erc721TokenHistoryEntity])],
  providers: [Erc721TokenHistoryService],
  exports: [Erc721TokenHistoryService],
})
export class Erc721TokenHistoryModule {}
