import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { ReferralRewardService } from "./reward.service";
import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { ReferralRewardSearchDto } from "./dto";
import { ReferralRewardEntity } from "./reward.entity";

@ApiBearerAuth()
@Controller("/referral/reward")
export class ReferralRewardController {
  constructor(private readonly referralRewardService: ReferralRewardService) {}

  // @Get("/search")
  // @UseInterceptors(PaginationInterceptor)
  // public search(
  //   @Query() dto: ReferralRewardSearchDto,
  //   @User() userEntity: UserEntity,
  // ): Promise<[Array<ReferralRewardEntity>, number]> {
  //   return this.referralRewardService.search(dto, userEntity);
  // }

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: ReferralRewardSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<ReferralRewardEntity>, number]> {
    return this.referralRewardService.getRefRewards(dto, userEntity);
  }

  // @ApiProduces("application/zip")
  // @Get("/export")
  // public async export(
  //   @Query() query: ReferralRewardSearchDto,
  //   @User() userEntity: UserEntity,
  //   @Res() res: Response,
  // ): Promise<void> {
  //   const csv = await this.referralRewardService.export(query, userEntity);
  //
  //   const archive = archiver("zip");
  //
  //   const date = new Date().toISOString().split("T")[0];
  //   archive.append(csv, { name: `referral-program-reward-${date}.csv` });
  //
  //   res.set({
  //     "Content-Disposition": `attachment; filename=referral-program-reward-${date}.zip`,
  //     "Content-Type": "application/zip",
  //     // "Content-Length": ??,
  //   });
  //
  //   archive.pipe(res);
  //
  //   await archive.finalize();
  // }
}
