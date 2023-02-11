import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { WaitlistItemEntity } from "./item.entity";
import { WaitlistItemServiceEth } from "./item.service.eth";
import { WaitlistItemControllerEth } from "./item.controller.eth";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";

@Module({
  imports: [EventHistoryModule, ContractModule, TypeOrmModule.forFeature([WaitlistItemEntity])],
  providers: [Logger, WaitlistItemServiceEth],
  controllers: [WaitlistItemControllerEth],
  exports: [WaitlistItemServiceEth],
})
export class WaitlistItemModule {}
