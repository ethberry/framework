import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuctionService } from "./auction.service";
import { AuctionController } from "./auction.controller";
import { Erc721AuctionEntity } from "./auction.entity";
import { Erc721AuctionHistoryModule } from "../auction-history/auction-history.module";

@Module({
  imports: [Erc721AuctionHistoryModule, TypeOrmModule.forFeature([Erc721AuctionEntity])],
  providers: [Logger, AuctionService],
  controllers: [AuctionController],
  exports: [AuctionService],
})
export class Erc721AuctionModule {}
