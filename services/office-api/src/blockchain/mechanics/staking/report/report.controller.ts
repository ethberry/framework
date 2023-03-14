import { Controller, Get, Query, Res, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiProduces } from "@nestjs/swagger";
import { Response } from "express";
import archiver from "archiver";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";

import { StakingReportService } from "./report.service";
import { StakingDepositEntity } from "../deposit/deposit.entity";
import { StakingReportSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/staking/report")
export class StakingDepositController {
  constructor(private readonly stakingReportService: StakingReportService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: StakingReportSearchDto): Promise<[Array<StakingDepositEntity>, number]> {
    return this.stakingReportService.search(dto);
  }

  @ApiProduces("application/zip")
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
