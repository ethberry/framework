import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LotteryTicketService } from "./ticket.service";
import { LotteryTicketController } from "./ticket.controller";
import { TokenEntity } from "../../../hierarchy/token/token.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  providers: [LotteryTicketService],
  controllers: [LotteryTicketController],
  exports: [LotteryTicketService],
})
export class LotteryTicketModule {}
