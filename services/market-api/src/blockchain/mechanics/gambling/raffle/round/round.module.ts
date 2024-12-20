import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RaffleRoundService } from "./round.service";
import { RaffleRoundEntity } from "./round.entity";
import { RaffleRoundController } from "./round.controller";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { RaffleTicketTokenModule } from "../ticket/token/token.module";

@Module({
  imports: [ContractModule, RaffleTicketTokenModule, TypeOrmModule.forFeature([RaffleRoundEntity])],
  providers: [RaffleRoundService],
  controllers: [RaffleRoundController],
  exports: [RaffleRoundService],
})
export class RaffleRoundModule {}
