import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LotteryTicketService } from "./ticket.service";
import { LotteryTicketEntity } from "./ticket.entity";
import { LotteryTicketControllerEth } from "./ticket.controller.eth";
import { LotteryTicketServiceEth } from "./ticket.service.eth";

@Module({
  imports: [TypeOrmModule.forFeature([LotteryTicketEntity])],
  providers: [Logger, LotteryTicketService, LotteryTicketServiceEth],
  controllers: [LotteryTicketControllerEth],
  exports: [LotteryTicketService, LotteryTicketServiceEth],
})
export class LotteryTicketModule {}
