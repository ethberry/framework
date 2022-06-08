import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc20VestingServiceEth } from "./vesting.service.eth";
import { Erc20VestingEntity } from "./vesting.entity";
import { Erc20VestingControllerEth } from "./vesting.controller.eth";
import { Erc20VestingHistoryModule } from "../vesting-history/vesting-history.module";
import { Erc20VestingService } from "./vesting.service";
import { ContractManagerModule } from "../../blockchain/contract-manager/contract-manager.module";

@Module({
  imports: [ContractManagerModule, Erc20VestingHistoryModule, TypeOrmModule.forFeature([Erc20VestingEntity])],
  providers: [Logger, Erc20VestingService, Erc20VestingServiceEth],
  controllers: [Erc20VestingControllerEth],
  exports: [Erc20VestingService, Erc20VestingServiceEth],
})
export class Erc20VestingModule {}
