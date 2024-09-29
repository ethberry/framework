import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor, User } from "@ethberry/nest-js-utils";

import { ReferralTreeService } from "./referral.tree.service";
import { UserEntity } from "../../../../../../infrastructure/user/user.entity";
import { ReferralTreeEntity } from "./referral.tree.entity";
import { ReferralTreeSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/referral/tree")
export class ReferralTreeController {
  constructor(private readonly referralTreeService: ReferralTreeService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: ReferralTreeSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<ReferralTreeEntity>, number]> {
    return this.referralTreeService.search(dto, userEntity);
  }
}
