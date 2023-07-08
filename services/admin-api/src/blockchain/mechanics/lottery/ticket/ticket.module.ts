import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LotteryTicketService } from "./ticket.service";
import { LotteryTicketController } from "./ticket.controller";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [LotteryTicketService],
  controllers: [LotteryTicketController],
  exports: [LotteryTicketService],
})
export class LotteryTicketModule {}
