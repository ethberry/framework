import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { TypeOrmModule } from "@nestjs/typeorm";
import { StakingPenaltyService } from "./penalty.service";
import { StakingPenaltyEntity } from "./penalty.entity";
import { StakingPenaltyController } from "./penalty.controller";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([StakingPenaltyEntity])],
  controllers: [StakingPenaltyController],
  providers: [Logger, StakingPenaltyService],
  exports: [StakingPenaltyService],
})
export class StakingPenaltyModule {}
