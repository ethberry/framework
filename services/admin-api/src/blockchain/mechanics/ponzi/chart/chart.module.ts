import { Module } from "@nestjs/common";

import { PonziChartService } from "./chart.service";
import { PonziChartController } from "./chart.controller";
import { PonziDepositModule } from "../deposit/deposit.module";
import { PonziContractModule } from "../contract/contract.module";

@Module({
  imports: [PonziDepositModule, PonziContractModule],
  providers: [PonziChartService],
  controllers: [PonziChartController],
  exports: [PonziChartService],
})
export class PonziChartModule {}
