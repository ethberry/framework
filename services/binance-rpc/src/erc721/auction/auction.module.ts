import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721AuctionHistoryModule } from "../auction-history/auction-history.module";
import { Erc721TokenModule } from "../token/token.module";
import { Erc721AuctionService } from "./auction.service";
import { Erc721AuctionServiceWs } from "./auction.service.ws";
import { Erc721AuctionEntity } from "./auction.entity";
import { Erc721AuctionControllerWs } from "./auction.controller.ws";

@Module({
  imports: [
    ConfigModule,
    Erc721TokenModule,
    Erc721AuctionHistoryModule,
    TypeOrmModule.forFeature([Erc721AuctionEntity]),
  ],
  providers: [Logger, Erc721AuctionService, Erc721AuctionServiceWs],
  controllers: [Erc721AuctionControllerWs],
  exports: [Erc721AuctionService, Erc721AuctionServiceWs],
})
export class Erc721AuctionModule {}
