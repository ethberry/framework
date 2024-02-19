import { Logger, Module } from "@nestjs/common";

import { WaitListService } from "./wait-list.service";
import { WaitListControllerRmq } from "./wait-list.controller.rmq";

@Module({
  imports: [],
  providers: [Logger, WaitListService],
  controllers: [WaitListControllerRmq],
  exports: [WaitListService],
})
export class WaitListModule {}
