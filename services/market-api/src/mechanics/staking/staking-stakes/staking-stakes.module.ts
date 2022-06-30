import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StakingStakesService } from "./staking-stakes.service";
import { StakingStakesController } from "./staking-stakes.controller";
import { StakingStakesEntity } from "./staking-stakes.entity";

@Module({
  imports: [TypeOrmModule.forFeature([StakingStakesEntity])],
  providers: [StakingStakesService],
  controllers: [StakingStakesController],
  exports: [StakingStakesService],
})
export class StakingStakesModule {}
