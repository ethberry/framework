import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721AuctionHistoryEntity } from "./auction-history.entity";
import { Erc721AuctionHistoryService } from "./auction-history.service";
import { Erc721AuctionHistoryController } from "./auction-history.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Erc721AuctionHistoryEntity])],
  providers: [Erc721AuctionHistoryService],
  controllers: [Erc721AuctionHistoryController],
  exports: [Erc721AuctionHistoryService],
})
export class Erc721AuctionHistoryModule {}
