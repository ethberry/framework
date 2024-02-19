import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { ReferralRewardService } from "./reward.service";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { ReferralRewardSearchDto } from "./dto";
import { ReferralRewardEntity } from "./reward.entity";

@ApiBearerAuth()
@Controller("/referral/reward")
export class ReferralRewardController {
  constructor(private readonly referralRewardService: ReferralRewardService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: ReferralRewardSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<ReferralRewardEntity>, number]> {
    return this.referralRewardService.getRefRewards(dto, userEntity);
  }
}
