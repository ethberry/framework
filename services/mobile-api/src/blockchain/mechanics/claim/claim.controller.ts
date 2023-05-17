import { Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@gemunion/nest-js-utils";
import { IClaim } from "@framework/types";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { ClaimService } from "./claim.service";

@ApiBearerAuth()
@Controller("/claims")
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  @Post("/test")
  public create(@User() userEntity: UserEntity): Promise<IClaim | undefined> {
    return this.claimService.test(userEntity);
  }
}
