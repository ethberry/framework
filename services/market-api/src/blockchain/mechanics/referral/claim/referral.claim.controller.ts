import { Controller, Post, HttpCode } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@gemunion/nest-js-utils";

import { ReferralClaimService } from "./referral.claim.service";
import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { ReferralClaimEntity } from "./referral.claim.entity";

@ApiBearerAuth()
@Controller("/referral/claim")
export class ReferralClaimController {
  constructor(private readonly referralClaimService: ReferralClaimService) {}

  @Post("/create")
  @HttpCode(204)
  public claim(@User() userEntity: UserEntity): Promise<ReferralClaimEntity | null> {
    return this.referralClaimService.createRefClaim(userEntity);
  }
}
