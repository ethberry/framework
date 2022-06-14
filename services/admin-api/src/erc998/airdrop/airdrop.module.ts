import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { Erc998AirdropEntity } from "./airdrop.entity";
import { Erc998AirderopService } from "./airdrop.service";
import { Erc998AirdropController } from "./airdrop.controller";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Erc998AirdropEntity])],
  providers: [Logger, ethersSignerProvider, ethersRpcProvider, Erc998AirderopService],
  controllers: [Erc998AirdropController],
  exports: [Erc998AirderopService],
})
export class Erc998AirdropModule {}
