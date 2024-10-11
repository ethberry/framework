import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { ContractModule } from "../../blockchain/hierarchy/contract/contract.module";
import { RatePlanService } from "./rate-plan.service";
import { RatePlanEntity } from "./rate-plan.entity";
import { RatePlanController } from "./rate-plan.controller";

@Module({
  imports: [ConfigModule, ContractModule, TypeOrmModule.forFeature([RatePlanEntity])],
  providers: [RatePlanService],
  controllers: [RatePlanController],
  exports: [RatePlanService],
})
export class RatePlanModule {}
