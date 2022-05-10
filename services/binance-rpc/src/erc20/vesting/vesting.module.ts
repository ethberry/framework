import { Module, Logger } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc20VestingServiceWs } from "./vesting.service.ws";
import { Erc20VestingEntity } from "./vesting.entity";
import { Erc20VestingControllerWs } from "./vesting.controller.ws";
import { Erc20VestingHistoryModule } from "../vesting-history/vesting-history.module";
import { Erc20VestingService } from "./vesting.service";
import { Erc20TokenModule } from "../token/token.module";

@Module({
  imports: [Erc20TokenModule, Erc20VestingHistoryModule, TypeOrmModule.forFeature([Erc20VestingEntity])],
  providers: [Logger, Erc20VestingService, Erc20VestingServiceWs],
  controllers: [Erc20VestingControllerWs],
  exports: [Erc20VestingService, Erc20VestingServiceWs],
})
export class Erc20VestingModule {}
