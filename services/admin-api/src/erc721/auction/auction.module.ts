import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721AuctionEntity } from "./auction.entity";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Erc721AuctionEntity])],
})
export class Erc721AuctionModule {}
