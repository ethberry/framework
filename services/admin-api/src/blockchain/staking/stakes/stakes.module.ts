import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StakesService } from "./stakes.service";
import { StakesController } from "./stakes.controller";
import { StakesEntity } from "./stakes.entity";

@Module({
  imports: [TypeOrmModule.forFeature([StakesEntity])],
  providers: [StakesService],
  controllers: [StakesController],
  exports: [StakesService],
})
export class StakesModule {}
