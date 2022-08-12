import { Module } from "@nestjs/common";

import { LotterySignController } from "./sign.controller";
import { LotterySignService } from "./sign.service";

@Module({
  providers: [LotterySignService],
  controllers: [LotterySignController],
  exports: [LotterySignService],
})
export class LotterySignModule {}
