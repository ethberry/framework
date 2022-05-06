import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { Erc721AirdropEntity } from "./airdrop.entity";
import { Erc721AirderopService } from "./airdrop.service";
import { Erc721AirdropController } from "./airdrop.controller";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Erc721AirdropEntity])],
  providers: [Logger, ethersSignerProvider, ethersRpcProvider, Erc721AirderopService],
  controllers: [Erc721AirdropController],
  exports: [Erc721AirderopService],
})
export class Erc721AirdropModule {}
