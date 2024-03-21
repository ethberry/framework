import { Controller, Get, Query, Res, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiProduces } from "@nestjs/swagger";
import type { Response } from "express";
import archiver from "archiver";

import { PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { ReferralReportService } from "./report.service";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { ReferralReportSearchDto } from "../reward/dto";
import { ReferralRewardEntity } from "../reward/referral.reward.entity";

@ApiBearerAuth()
@Controller("/referral/report")
export class ReferralReportController {
  constructor(private readonly referralReportService: ReferralReportService) {}

  @Get("/search")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: ReferralReportSearchDto): Promise<[Array<ReferralRewardEntity>, number]> {
    return this.referralReportService.search(dto);
  }

  @Get("/chart")
  @UseInterceptors(PaginationInterceptor)
  public chart(@Query() dto: ReferralReportSearchDto, @User() userEntity: UserEntity): Promise<any> {
    return this.referralReportService.chart(dto, userEntity);
  }

  @ApiProduces("application/zip")
  @Get("/export")
  public async export(@Query() dto: ReferralReportSearchDto, @Res() res: Response): Promise<void> {
    const csv = await this.referralReportService.export(dto);

    const archive = archiver("zip");

    const date = new Date().toISOString().split("T")[0];
    archive.append(csv, { name: `referral-program-report-${date}.csv` });

    res.set({
      "Content-Disposition": `attachment; filename=referral-program-report-${date}.zip`,
      "Content-Type": "application/zip",
      // "Content-Length": ??,
    });

    archive.pipe(res);

    await archive.finalize();
  }
}
