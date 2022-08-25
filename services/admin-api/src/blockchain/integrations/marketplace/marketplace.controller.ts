import { Controller, Get, Query, Res, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Response } from "express";
import archiver from "archiver";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";

import { MarketplaceService } from "./marketplace.service";
import { TokenEntity } from "../../hierarchy/token/token.entity";
import { MarketplaceReportSearchDto } from "./dto";
import { MarketplaceSupplySearchDto } from "./dto/supply";

@ApiBearerAuth()
@Controller("/marketplace/report")
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get("/search")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: MarketplaceReportSearchDto): Promise<[Array<TokenEntity>, number]> {
    return this.marketplaceService.search(dto);
  }

  @Get("/chart")
  @UseInterceptors(PaginationInterceptor)
  public chart(@Query() dto: MarketplaceReportSearchDto): Promise<any> {
    return this.marketplaceService.chart(dto);
  }

  @Get("/supply")
  @UseInterceptors(PaginationInterceptor)
  public rarity(@Query() dto: MarketplaceSupplySearchDto): Promise<any> {
    return this.marketplaceService.supply(dto);
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
