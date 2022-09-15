import { Module } from "@nestjs/common";

import { PyramidChartService } from "./chart.service";
import { PyramidChartController } from "./chart.controller";
import { PyramidDepositModule } from "../deposit/deposit.module";

@Module({
  imports: [PyramidDepositModule],
  providers: [PyramidChartService],
  controllers: [PyramidChartController],
  exports: [PyramidChartService],
})
export class PyramidChartModule {}
