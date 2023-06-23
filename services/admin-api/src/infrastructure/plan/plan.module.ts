import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RatePlanService } from "./plan.service";
import { RatePlanEntity } from "./plan.entity";
import { MerchantModule } from "../merchant/merchant.module";

@Module({
  imports: [MerchantModule, TypeOrmModule.forFeature([RatePlanEntity])],
  providers: [RatePlanService],
  exports: [RatePlanService],
})
export class RatePlanModule {}
