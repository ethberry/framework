import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PyramidStakesService } from "./stakes.service";
import { PyramidStakesEntity } from "./stakes.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PyramidStakesEntity])],
  providers: [PyramidStakesService],
  exports: [PyramidStakesService],
})
export class PyramidStakesModule {}
