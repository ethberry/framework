import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LotteryTicketService } from "./ticket.service";
import { LotteryTicketEntity } from "./ticket.entity";
import { LotteryTicketController } from "./ticket.controller";

@Module({
  imports: [TypeOrmModule.forFeature([LotteryTicketEntity])],
  providers: [LotteryTicketService],
  controllers: [LotteryTicketController],
  exports: [LotteryTicketService],
})
export class LotteryTicketModule {}
