import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { TypeOrmModule } from "@nestjs/typeorm";
import { StakingPenaltyService } from "./penalty.service";
import { StakingPenaltyEntity } from "./penalty.entity";
import { signalServiceProvider } from "../../../../../common/providers";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([StakingPenaltyEntity])],
  providers: [Logger, signalServiceProvider, StakingPenaltyService],
  exports: [StakingPenaltyService],
})
export class StakingPenaltyModule {}
