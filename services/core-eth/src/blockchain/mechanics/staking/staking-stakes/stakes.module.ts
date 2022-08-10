import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StakingStakesService } from "./stakes.service";
import { StakingStakesEntity } from "./stakes.entity";

@Module({
  imports: [TypeOrmModule.forFeature([StakingStakesEntity])],
  providers: [StakingStakesService],
  exports: [StakingStakesService],
})
export class StakingStakesModule {}
