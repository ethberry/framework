import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LotteryTicketService } from "./ticket.service";
import { LotteryTicketEntity } from "./ticket.entity";
import { LotteryTicketControllerEth } from "./ticket.controller.eth";

@Module({
  imports: [TypeOrmModule.forFeature([LotteryTicketEntity])],
  providers: [LotteryTicketService],
  controllers: [LotteryTicketControllerEth],
  exports: [LotteryTicketService],
})
export class LotteryTicketModule {}
