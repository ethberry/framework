import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";
import { SignerModule } from "@gemunion/nest-js-module-exchange-signer";

import { LotterySignController } from "./sign.controller";
import { LotterySignService } from "./sign.service";
import { LotteryRoundModule } from "../round/round.module";

@Module({
  imports: [ConfigModule, LotteryRoundModule, SignerModule],
  providers: [Logger, ethersRpcProvider, ethersSignerProvider, LotterySignService],
  controllers: [LotterySignController],
  exports: [LotterySignService],
})
export class LotterySignModule {}
