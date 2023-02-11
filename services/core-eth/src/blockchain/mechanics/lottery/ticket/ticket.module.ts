import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { TypeOrmModule } from "@nestjs/typeorm";

import { BalanceModule } from "../../../hierarchy/balance/balance.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { LotteryRoundModule } from "../round/round.module";
import { LotteryTicketControllerEth } from "./ticket.controller.eth";
import { LotteryTicketEntity } from "./ticket.entity";
import { LotteryTicketLogModule } from "./log/log.module";
import { LotteryTicketService } from "./ticket.service";
import { LotteryTicketServiceEth } from "./ticket.service.eth";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";

@Module({
  imports: [
    ConfigModule,
    LotteryTicketLogModule,
    ContractModule,
    TokenModule,
    TemplateModule,
    BalanceModule,
    LotteryRoundModule,
    EventHistoryModule,
    TypeOrmModule.forFeature([LotteryTicketEntity]),
  ],
  providers: [Logger, LotteryTicketService, LotteryTicketServiceEth],
  controllers: [LotteryTicketControllerEth],
  exports: [LotteryTicketService, LotteryTicketServiceEth],
})
export class LotteryTicketModule {}
