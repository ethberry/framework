import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RatePlanService } from "./rate-plan.service";
import { RatePlanEntity } from "./rate-plan.entity";

@Module({
  imports: [TypeOrmModule.forFeature([RatePlanEntity])],
  providers: [RatePlanService],
  exports: [RatePlanService],
})
export class RatePlanModule {}
