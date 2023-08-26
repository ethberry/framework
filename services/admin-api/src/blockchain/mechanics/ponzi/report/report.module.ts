import { Module } from "@nestjs/common";

import { PonziReportService } from "./report.service";
import { PonziDepositController } from "./report.controller";
import { PonziDepositModule } from "../deposit/deposit.module";

@Module({
  imports: [PonziDepositModule],
  providers: [PonziReportService],
  controllers: [PonziDepositController],
  exports: [PonziReportService],
})
export class PonziReportModule {}
