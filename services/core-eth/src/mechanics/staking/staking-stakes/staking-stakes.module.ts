import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StakingStakesService } from "./staking-stakes.service";
import { StakingStakesEntity } from "./staking-stakes.entity";

@Module({
  imports: [TypeOrmModule.forFeature([StakingStakesEntity])],
  providers: [StakingStakesService],
  exports: [StakingStakesService],
})
export class StakingStakesModule {}
