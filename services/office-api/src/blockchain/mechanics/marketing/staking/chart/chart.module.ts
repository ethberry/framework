import { Module } from "@nestjs/common";

import { StakingChartService } from "./chart.service";
import { StakingChartController } from "./chart.controller";
import { StakingDepositModule } from "../deposit/deposit.module";

@Module({
  imports: [StakingDepositModule],
  providers: [StakingChartService],
  controllers: [StakingChartController],
  exports: [StakingChartService],
})
export class StakingChartModule {}
