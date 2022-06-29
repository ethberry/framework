import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { AirdropEntity } from "./airdrop.entity";
import { AirdropService } from "./airdrop.service";
import { AirdropController } from "./airdrop.controller";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([AirdropEntity])],
  providers: [Logger, ethersSignerProvider, ethersRpcProvider, AirdropService],
  controllers: [AirdropController],
  exports: [AirdropService],
})
export class AirdropModule {}
