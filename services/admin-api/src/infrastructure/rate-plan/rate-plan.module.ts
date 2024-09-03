import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RatePlanService } from "./rate-plan.service";
import { RatePlanEntity } from "./rate-plan.entity";
import { RatePlanController } from "./rate-plan.controller";

@Module({
  imports: [TypeOrmModule.forFeature([RatePlanEntity])],
  providers: [RatePlanService],
  controllers: [RatePlanController],
  exports: [RatePlanService],
})
export class RatePlanModule {}
