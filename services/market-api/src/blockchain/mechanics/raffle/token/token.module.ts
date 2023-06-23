import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RaffleTicketService } from "./token.service";
import { RaffleTicketController } from "./token.controller";
import { TokenEntity } from "../../../hierarchy/token/token.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  providers: [RaffleTicketService],
  controllers: [RaffleTicketController],
  exports: [RaffleTicketService],
})
export class RaffleTicketModule {}
