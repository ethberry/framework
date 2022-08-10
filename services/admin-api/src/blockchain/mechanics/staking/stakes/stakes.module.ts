import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StakingStakesService } from "./stakes.service";
import { StakingStakesController } from "./stakes.controller";
import { StakingStakesEntity } from "./stakes.entity";

@Module({
  imports: [TypeOrmModule.forFeature([StakingStakesEntity])],
  providers: [StakingStakesService],
  controllers: [StakingStakesController],
  exports: [StakingStakesService],
})
export class StakingStakesModule {}
