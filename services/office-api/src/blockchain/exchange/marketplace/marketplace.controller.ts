import { Controller, Get, Query, Res, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import type { Response } from "express";
import archiver from "archiver";

import { PaginationInterceptor, Public, User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { EventHistoryEntity } from "../../event-history/event-history.entity";
import { MarketplaceService } from "./marketplace.service";
import { MarketplaceReportSearchDto } from "./dto";
import { MarketplaceSupplySearchDto } from "./dto/supply";

@Public()
@ApiBearerAuth()
@Controller("/marketplace/report")
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get("/search")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: MarketplaceReportSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<EventHistoryEntity>, number]> {
    return this.marketplaceService.search(dto, userEntity);
  }

  @Get("/chart")
  @UseInterceptors(PaginationInterceptor)
  public chart(@Query() dto: MarketplaceReportSearchDto, @User() userEntity: UserEntity): Promise<any> {
    return this.marketplaceService.chart(dto, userEntity);
  }

  @Get("/supply")
  @UseInterceptors(PaginationInterceptor)
  public rarity(@Query() dto: MarketplaceSupplySearchDto, @User() userEntity: UserEntity): Promise<any> {
    return this.marketplaceService.supply(dto, userEntity);
  }

  @Get("/export")
  public async export(
    @Query() dto: MarketplaceReportSearchDto,
    @User() userEntity: UserEntity,
    @Res() res: Response,
  ): Promise<void> {
    const csv = await this.marketplaceService.export(dto, userEntity);

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
