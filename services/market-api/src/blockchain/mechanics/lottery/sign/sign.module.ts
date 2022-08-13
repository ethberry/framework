import { Module, Logger } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { LotterySignController } from "./sign.controller";
import { LotterySignService } from "./sign.service";

@Module({
  imports: [ConfigModule],
  providers: [Logger, ethersRpcProvider, ethersSignerProvider, LotterySignService],
  controllers: [LotterySignController],
  exports: [LotterySignService],
})
export class LotterySignModule {}
