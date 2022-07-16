import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { PaginationInterceptor, Public } from "@gemunion/nest-js-utils";
import { ClaimService } from "./claim.service";
import { ClaimEntity } from "./claim.entity";

import { ClaimSearchDto } from "./dto";

@Public()
@Controller("/claim")
export class ClaimController {
  constructor(private readonly erc998ClaimService: ClaimService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: ClaimSearchDto): Promise<[Array<ClaimEntity>, number]> {
    return this.erc998ClaimService.search(dto);
  }
}
