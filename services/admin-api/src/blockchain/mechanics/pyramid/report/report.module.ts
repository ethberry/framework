import { Module } from "@nestjs/common";

import { PyramidReportService } from "./report.service";
import { PyramidStakesController } from "./report.controller";
import { PyramidStakesModule } from "../stakes/stakes.module";

@Module({
  imports: [PyramidStakesModule],
  providers: [PyramidReportService],
  controllers: [PyramidStakesController],
  exports: [PyramidReportService],
})
export class PyramidReportModule {}
