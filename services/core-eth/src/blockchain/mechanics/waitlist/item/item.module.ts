import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { WaitlistItemEntity } from "./item.entity";
import { WaitlistItemServiceEth } from "./item.service.eth";
import { WaitlistItemControllerEth } from "./item.controller.eth";
import { ExchangeHistoryModule } from "../../../exchange/history/history.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";

@Module({
  imports: [ContractModule, ExchangeHistoryModule, TypeOrmModule.forFeature([WaitlistItemEntity])],
  providers: [Logger, WaitlistItemServiceEth],
  controllers: [WaitlistItemControllerEth],
  exports: [WaitlistItemServiceEth],
})
export class WaitlistItemModule {}
