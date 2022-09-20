import { Module } from "@nestjs/common";

import { PyramidReportService } from "./report.service";
import { PyramidDepositController } from "./report.controller";
import { PyramidDepositModule } from "../deposit/deposit.module";

@Module({
  imports: [PyramidDepositModule],
  providers: [PyramidReportService],
  controllers: [PyramidDepositController],
  exports: [PyramidReportService],
})
export class PyramidReportModule {}
