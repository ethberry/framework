import { Logger, Module } from "@nestjs/common";

import { CoreService } from "./core.service";
import { CoreControllerRmq } from "./core.controller.rmq";

@Module({
  imports: [],
  providers: [Logger, CoreService],
  controllers: [CoreControllerRmq],
  exports: [CoreService],
})
export class CoreModule {}
