import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LotteryTicketService } from "./ticket.service";
import { LotteryTicketController } from "./ticket.controller";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ContractEntity])],
  providers: [LotteryTicketService],
  controllers: [LotteryTicketController],
  exports: [LotteryTicketService],
})
export class LotteryTicketModule {}
