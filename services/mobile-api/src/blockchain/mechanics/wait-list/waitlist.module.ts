import { Logger, Module } from "@nestjs/common";

import { WaitListService } from "./waitlist.service";
import { WaitListControllerRmq } from "./waitlist.controller.rmq";

@Module({
  imports: [],
  providers: [Logger, WaitListService],
  controllers: [WaitListControllerRmq],
  exports: [WaitListService],
})
export class WaitListModule {}
