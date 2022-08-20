import { Controller, Get, Query, Res, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Response } from "express";
import archiver from "archiver";

import { PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { MarketplaceReportSearchDto } from "./dto";
import { ReferralRewardEntity } from "./reward.entity";
import { ReferralRewardService } from "./reward.service";
import { UserEntity } from "../../../../user/user.entity";

@ApiBearerAuth()
@Controller("/referral")
export class ReferralRewardController {
  constructor(private readonly referralRewardService: ReferralRewardService) {}

  @Get("/report")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: MarketplaceReportSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<ReferralRewardEntity>, number]> {
    return this.referralRewardService.search(dto, userEntity);
  }

  @Get("/export")
  public async export(
    @Query() query: MarketplaceReportSearchDto,
    @User() userEntity: UserEntity,
    @Res() res: Response,
  ): Promise<void> {
    const csv = await this.referralRewardService.export(query, userEntity);

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
