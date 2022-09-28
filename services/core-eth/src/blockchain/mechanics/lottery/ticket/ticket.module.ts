import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LotteryTicketService } from "./ticket.service";
import { LotteryTicketEntity } from "./ticket.entity";
import { LotteryTicketControllerEth } from "./ticket.controller.eth";
import { LotteryTicketServiceEth } from "./ticket.service.eth";
import { LotteryRoundModule } from "../round/round.module";
import { LotteryHistoryModule } from "../history/history.module";
import { TokenModule } from "../../../hierarchy/token/token.module";

@Module({
  imports: [TokenModule, LotteryRoundModule, LotteryHistoryModule, TypeOrmModule.forFeature([LotteryTicketEntity])],
  providers: [Logger, LotteryTicketService, LotteryTicketServiceEth],
  controllers: [LotteryTicketControllerEth],
  exports: [LotteryTicketService, LotteryTicketServiceEth],
})
export class LotteryTicketModule {}
