import { Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";

import { RaffleRoundService } from "./round.service";
import { RaffleRoundEntity } from "./round.entity";
import { RaffleRoundController } from "./round.controller";

@Module({
  imports: [TypeOrmModule.forFeature([RaffleRoundEntity])],
  providers: [RaffleRoundService],
  controllers: [RaffleRoundController],
  exports: [RaffleRoundService],
})
export class RaffleRoundModule {}
