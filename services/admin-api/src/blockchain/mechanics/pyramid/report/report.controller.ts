import { Controller, Get, Query, Res, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiProduces } from "@nestjs/swagger";
import { Response } from "express";
import archiver from "archiver";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";

import { PyramidReportService } from "./report.service";
import { PyramidDepositEntity } from "../deposit/deposit.entity";
import { PyramidReportSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/pyramid/report")
export class PyramidDepositController {
  constructor(private readonly pyramidReportService: PyramidReportService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: PyramidReportSearchDto): Promise<[Array<PyramidDepositEntity>, number]> {
    return this.pyramidReportService.search(dto);
  }

  @ApiProduces("application/pdf")
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
