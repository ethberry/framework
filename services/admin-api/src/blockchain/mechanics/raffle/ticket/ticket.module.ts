import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RaffleTicketService } from "./ticket.service";
import { RaffleTicketController } from "./ticket.controller";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [RaffleTicketService],
  controllers: [RaffleTicketController],
  exports: [RaffleTicketService],
})
export class RaffleTicketModule {}
