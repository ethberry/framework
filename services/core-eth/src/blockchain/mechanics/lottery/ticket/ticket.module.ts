import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BalanceModule } from "../../../hierarchy/balance/balance.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { LotteryHistoryModule } from "../history/history.module";
import { LotteryRoundModule } from "../round/round.module";
import { LotteryTicketControllerEth } from "./ticket.controller.eth";
import { LotteryTicketEntity } from "./ticket.entity";
import { LotteryTicketLogModule } from "./log/log.module";
import { LotteryTicketService } from "./ticket.service";
import { LotteryTicketServiceEth } from "./ticket.service.eth";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { TokenModule } from "../../../hierarchy/token/token.module";

@Module({
  imports: [
    LotteryTicketLogModule,
    ContractModule,
    TokenModule,
    TemplateModule,
    BalanceModule,
    LotteryRoundModule,
    LotteryHistoryModule,
    TypeOrmModule.forFeature([LotteryTicketEntity]),
  ],
  providers: [Logger, LotteryTicketService, LotteryTicketServiceEth],
  controllers: [LotteryTicketControllerEth],
  exports: [LotteryTicketService, LotteryTicketServiceEth],
})
export class LotteryTicketModule {}
