import { Controller, Get, Query, Res, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiProduces } from "@nestjs/swagger";
import { Response } from "express";
import archiver from "archiver";

import { PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { StakingDepositEntity } from "../deposit/deposit.entity";
import { StakingReportService } from "./report.service";
import { StakingReportSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/staking")
export class StakingReportController {
  constructor(private readonly stakingReportService: StakingReportService) {}

  @Get("/report")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: StakingReportSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<StakingDepositEntity>, number]> {
    return this.stakingReportService.search(dto, userEntity);
  }

  @ApiProduces("application/zip")
  @Get("/report/export")
  public async export(
    @Query() query: StakingReportSearchDto,
    @User() userEntity: UserEntity,
    @Res() res: Response,
  ): Promise<void> {
    const csv = await this.stakingReportService.export(query, userEntity);

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
