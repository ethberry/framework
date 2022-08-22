import { Module } from "@nestjs/common";

import { StakingReportService } from "./report.service";
import { StakingStakesController } from "./report.controller";
import { StakingStakesModule } from "../stakes/stakes.module";

@Module({
  imports: [StakingStakesModule],
  providers: [StakingReportService],
  controllers: [StakingStakesController],
  exports: [StakingReportService],
})
export class StakingReportModule {}
