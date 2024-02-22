import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { ReferralTreeService } from "./referral.tree.service";
import { ReferralTreeSearchDto } from "./dto";
import { UserEntity } from "../../../../../../infrastructure/user/user.entity";
import { ReferralTreeEntity } from "./referral.tree.entity";

@ApiBearerAuth()
@Controller("/referral/tree")
export class ReferralTreeController {
  constructor(private readonly referralTreeService: ReferralTreeService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public async search(
    @Query() dto: ReferralTreeSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<ReferralTreeEntity>, number]> {
    return this.referralTreeService.getReferralTree(dto, userEntity);
  }
}
