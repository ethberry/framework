import { Module } from "@nestjs/common";

import { StakingReportService } from "./report.service";
import { StakingDepositController } from "./report.controller";
import { StakingDepositModule } from "../deposit/deposit.module";

@Module({
  imports: [StakingDepositModule],
  providers: [StakingReportService],
  controllers: [StakingDepositController],
  exports: [StakingReportService],
})
export class StakingReportModule {}
