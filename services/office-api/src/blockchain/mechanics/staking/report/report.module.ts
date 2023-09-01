import { Module } from "@nestjs/common";

import { StakingReportService } from "./report.service";
import { StakingReportController } from "./report.controller";
import { StakingDepositModule } from "../deposit/deposit.module";

@Module({
  imports: [StakingDepositModule],
  providers: [StakingReportService],
  controllers: [StakingReportController],
  exports: [StakingReportService],
})
export class StakingReportModule {}
