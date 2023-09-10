import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";

import { PaginationInterceptor, Public, User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { ClaimService } from "./claim.service";
import { ClaimEntity } from "./claim.entity";
import { ClaimSearchDto } from "./dto";

@Public()
@Controller("/claim")
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: ClaimSearchDto, @User() userEntity: UserEntity): Promise<[Array<ClaimEntity>, number]> {
    return this.claimService.search(dto, userEntity);
  }
}
