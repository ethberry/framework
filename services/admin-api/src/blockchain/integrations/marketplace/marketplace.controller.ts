import { Controller, Get, Query, Res, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Response } from "express";
import archiver from "archiver";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";

import { MarketplaceService } from "./marketplace.service";
import { TokenEntity } from "../../hierarchy/token/token.entity";
import { MarketplaceReportSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/marketplace")
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get("/report")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: MarketplaceReportSearchDto): Promise<[Array<TokenEntity>, number]> {
    return this.marketplaceService.search(dto);
  }

  @Get("/export")
  public async export(@Query() query: MarketplaceReportSearchDto, @Res() res: Response): Promise<void> {
    const csv = await this.marketplaceService.export(query);

    const archive = archiver("zip");

    const date = new Date().toISOString().split("T")[0];
    archive.append(csv, { name: `marketplace-report-${date}.csv` });

    res.set({
      "Content-Disposition": `attachment; filename=marketplace-report-${date}.zip`,
      "Content-Type": "application/zip",
      // "Content-Length": ??,
    });

    archive.pipe(res);

    await archive.finalize();
  }
}
