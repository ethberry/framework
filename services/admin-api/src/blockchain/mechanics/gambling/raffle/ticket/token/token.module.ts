import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RaffleTicketTokentService } from "./token.service";
import { RaffleTicketTokenController } from "./token.controller";
import { TokenEntity } from "../../../../../hierarchy/token/token.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  providers: [RaffleTicketTokentService],
  controllers: [RaffleTicketTokenController],
  exports: [RaffleTicketTokentService],
})
export class RaffleTicketTokenModule {}
