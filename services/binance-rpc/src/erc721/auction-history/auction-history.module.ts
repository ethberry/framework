import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721AuctionHistoryEntity } from "./auction-history.entity";
import { Erc721AuctionHistoryService } from "./auction-history.service";

@Module({
  imports: [TypeOrmModule.forFeature([Erc721AuctionHistoryEntity])],
  providers: [Erc721AuctionHistoryService],
  exports: [Erc721AuctionHistoryService],
})
export class Erc721AuctionHistoryModule {}
