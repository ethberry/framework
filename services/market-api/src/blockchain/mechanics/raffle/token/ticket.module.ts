import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RaffleTicketService } from "./ticket.service";
import { RaffleTicketController } from "./ticket.controller";
import { TokenEntity } from "../../../hierarchy/token/token.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  providers: [RaffleTicketService],
  controllers: [RaffleTicketController],
  exports: [RaffleTicketService],
})
export class RaffleTicketModule {}
