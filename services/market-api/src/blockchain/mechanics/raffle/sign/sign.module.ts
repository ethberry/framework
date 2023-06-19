import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";
import { SignerModule } from "@gemunion/nest-js-module-exchange-signer";

import { RaffleSignController } from "./sign.controller";
import { RaffleSignService } from "./sign.service";
import { RaffleRoundModule } from "../round/round.module";

@Module({
  imports: [ConfigModule, RaffleRoundModule, SignerModule],
  providers: [Logger, ethersRpcProvider, ethersSignerProvider, RaffleSignService],
  controllers: [RaffleSignController],
  exports: [RaffleSignService],
})
export class RaffleSignModule {}
