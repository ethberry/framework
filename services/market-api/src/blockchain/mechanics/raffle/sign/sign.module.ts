import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { RaffleSignController } from "./sign.controller";
import { RaffleSignService } from "./sign.service";

@Module({
  imports: [ConfigModule],
  providers: [Logger, ethersRpcProvider, ethersSignerProvider, RaffleSignService],
  controllers: [RaffleSignController],
  exports: [RaffleSignService],
})
export class RaffleSignModule {}
