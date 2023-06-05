import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RaffleTicketService } from "./ticket.service";
import { RaffleTicketEntity } from "./ticket.entity";
import { RaffleTicketController } from "./ticket.controller";

@Module({
  imports: [TypeOrmModule.forFeature([RaffleTicketEntity])],
  providers: [RaffleTicketService],
  controllers: [RaffleTicketController],
  exports: [RaffleTicketService],
})
export class RaffleTicketModule {}
