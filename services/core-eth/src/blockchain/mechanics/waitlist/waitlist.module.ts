import { Module, Logger } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { WaitlistEntity } from "./waitlist.entity";
import { WaitlistServiceEth } from "./waitlist.service.eth";
import { WaitlistControllerEth } from "./waitlist.controller.eth";
import { WaitlistLogModule } from "./log/log.module";
import { ExchangeHistoryModule } from "../exchange/history/exchange-history.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";

@Module({
  imports: [ContractModule, ExchangeHistoryModule, WaitlistLogModule, TypeOrmModule.forFeature([WaitlistEntity])],
  providers: [Logger, WaitlistServiceEth],
  controllers: [WaitlistControllerEth],
  exports: [WaitlistServiceEth],
})
export class WaitlistModule {}
