import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { SearchDto } from "@gemunion/collection";
import { PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../../../../user/user.entity";
import { ReferralRewardEntity } from "./reward.entity";
import { ReferralRewardService } from "./reward.service";

@ApiBearerAuth()
@Controller("/referral/reward")
export class ReferralRewardController {
  constructor(private readonly referralRewardService: ReferralRewardService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: SearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<ReferralRewardEntity>, number]> {
    return this.referralRewardService.search(dto, userEntity);
  }
}
