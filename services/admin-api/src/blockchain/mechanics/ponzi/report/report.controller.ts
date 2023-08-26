import { Controller, Get, Query, Res, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiProduces } from "@nestjs/swagger";
import { Response } from "express";
import archiver from "archiver";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";

import { PonziReportService } from "./report.service";
import { PonziDepositEntity } from "../deposit/deposit.entity";
import { PonziReportSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/ponzi")
export class PonziDepositController {
  constructor(private readonly ponziReportService: PonziReportService) {}

  @Get("/report")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: PonziReportSearchDto): Promise<[Array<PonziDepositEntity>, number]> {
    return this.ponziReportService.search(dto);
  }

  @ApiProduces("application/zip")
  @Get("/report/export")
  public async export(@Query() query: PonziReportSearchDto, @Res() res: Response): Promise<void> {
    const csv = await this.ponziReportService.export(query);

    const archive = archiver("zip");

    const date = new Date().toISOString().split("T")[0];
    archive.append(csv, { name: `ponzi-report-${date}.csv` });

    res.set({
      "Content-Disposition": `attachment; filename=ponzi-report-${date}.zip`,
      "Content-Type": "application/zip",
      // "Content-Length": ??,
    });

    archive.pipe(res);

    await archive.finalize();
  }
}
