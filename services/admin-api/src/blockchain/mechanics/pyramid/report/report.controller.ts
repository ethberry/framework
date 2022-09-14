import { Controller, Get, Query, Res, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Response } from "express";
import archiver from "archiver";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";

import { PyramidReportService } from "./report.service";
import { PyramidStakesEntity } from "../stakes/stakes.entity";
import { PyramidReportSearchDto } from "./dto";
import { PyramidChartSearchDto } from "./dto/chart";

@ApiBearerAuth()
@Controller("/pyramid/report")
export class PyramidStakesController {
  constructor(private readonly pyramidReportService: PyramidReportService) {}

  @Get("/search")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: PyramidReportSearchDto): Promise<[Array<PyramidStakesEntity>, number]> {
    return this.pyramidReportService.search(dto);
  }

  @Get("/chart")
  @UseInterceptors(PaginationInterceptor)
  public chart(@Query() dto: PyramidChartSearchDto): Promise<any> {
    return this.pyramidReportService.chart(dto);
  }

  @Get("/export")
  public async export(@Query() query: PyramidReportSearchDto, @Res() res: Response): Promise<void> {
    const csv = await this.pyramidReportService.export(query);

    const archive = archiver("zip");

    const date = new Date().toISOString().split("T")[0];
    archive.append(csv, { name: `pyramid-report-${date}.csv` });

    res.set({
      "Content-Disposition": `attachment; filename=pyramid-report-${date}.zip`,
      "Content-Type": "application/zip",
      // "Content-Length": ??,
    });

    archive.pipe(res);

    await archive.finalize();
  }
}
