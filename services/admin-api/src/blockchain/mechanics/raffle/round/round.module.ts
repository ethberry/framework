import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { TypeOrmModule } from "@nestjs/typeorm";

import { scheduleRaffleServiceProvider } from "../../../../common/providers";

import { RaffleRoundService } from "./round.service";
import { RaffleRoundEntity } from "./round.entity";
import { RaffleRoundController } from "./round.controller";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([RaffleRoundEntity])],
  providers: [scheduleRaffleServiceProvider, RaffleRoundService],
  controllers: [RaffleRoundController],
  exports: [RaffleRoundService],
})
export class RaffleRoundModule {}
