import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RaffleRoundService } from "./round.service";
import { RaffleRoundEntity } from "./round.entity";
import { RaffleRoundController } from "./round.controller";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { RaffleTokenModule } from "../token/token.module";

@Module({
  imports: [ContractModule, RaffleTokenModule, TypeOrmModule.forFeature([RaffleRoundEntity])],
  providers: [RaffleRoundService],
  controllers: [RaffleRoundController],
  exports: [RaffleRoundService],
})
export class RaffleRoundModule {}
