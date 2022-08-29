import { Controller, Get, Query, Res, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Response } from "express";
import archiver from "archiver";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";

import { StakingReportService } from "./report.service";
import { StakingStakesEntity } from "../stakes/stakes.entity";
import { StakingReportSearchDto } from "./dto";
import { StakingChartSearchDto } from "./dto/chart";

@ApiBearerAuth()
@Controller("/staking/report")
export class StakingStakesController {
  constructor(private readonly stakingReportService: StakingReportService) {}

  @Get("/search")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: StakingReportSearchDto): Promise<[Array<StakingStakesEntity>, number]> {
    return this.stakingReportService.search(dto);
  }

  @Get("/chart")
  @UseInterceptors(PaginationInterceptor)
  public chart(@Query() dto: StakingChartSearchDto): Promise<any> {
    return this.stakingReportService.chart(dto);
  }

  @Get("/export")
  public async export(@Query() query: StakingReportSearchDto, @Res() res: Response): Promise<void> {
    const csv = await this.stakingReportService.export(query);

    const archive = archiver("zip");

    const date = new Date().toISOString().split("T")[0];
    archive.append(csv, { name: `staking-report-${date}.csv` });

    res.set({
      "Content-Disposition": `attachment; filename=staking-report-${date}.zip`,
      "Content-Type": "application/zip",
      // "Content-Length": ??,
    });

    archive.pipe(res);

    await archive.finalize();
  }
}
