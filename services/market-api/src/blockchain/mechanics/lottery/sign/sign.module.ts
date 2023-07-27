import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { SignerModule } from "@framework/nest-js-module-exchange-signer";

import { LotterySignController } from "./sign.controller";
import { LotterySignService } from "./sign.service";
import { LotteryRoundModule } from "../round/round.module";

@Module({
  imports: [ConfigModule, LotteryRoundModule, SignerModule],
  providers: [Logger, LotterySignService],
  controllers: [LotterySignController],
  exports: [LotterySignService],
})
export class LotterySignModule {}
