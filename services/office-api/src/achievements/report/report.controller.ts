import { Controller, Get, Query, Res, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiProduces } from "@nestjs/swagger";
import { Response } from "express";
import archiver from "archiver";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";

import { AchievementReportService } from "./report.service";
import { AchievementsReportSearchDto } from "./dto";
import { AchievementItemEntity } from "../item/item.entity";

@ApiBearerAuth()
@Controller("/achievements/report")
export class AchievementReportController {
  constructor(private readonly achievementReportService: AchievementReportService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: AchievementsReportSearchDto): Promise<[Array<AchievementItemEntity>, number]> {
    return this.achievementReportService.search(dto);
  }

  @ApiProduces("application/zip")
  @Get("/export")
  public async export(@Query() query: AchievementsReportSearchDto, @Res() res: Response): Promise<void> {
    const csv = await this.achievementReportService.export(query);

    const archive = archiver("zip");

    const date = new Date().toISOString().split("T")[0];
    archive.append(csv, { name: `achievements-report-${date}.csv` });

    res.set({
      "Content-Disposition": `attachment; filename=staking-report-${date}.zip`,
      "Content-Type": "application/zip",
      // "Content-Length": ??,
    });

    archive.pipe(res);

    await archive.finalize();
  }
}
