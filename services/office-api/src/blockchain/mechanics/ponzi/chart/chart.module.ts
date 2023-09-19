import { Module } from "@nestjs/common";

import { PonziChartService } from "./chart.service";
import { PonziChartController } from "./chart.controller";
import { PonziDepositModule } from "../deposit/deposit.module";

@Module({
  imports: [PonziDepositModule],
  providers: [PonziChartService],
  controllers: [PonziChartController],
  exports: [PonziChartService],
})
export class PonziChartModule {}
