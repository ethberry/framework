import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, Public, User } from "@gemunion/nest-js-utils";

import { MerchantEntity } from "../../../infrastructure/merchant/merchant.entity";
import { ContractEntity } from "../../hierarchy/contract/contract.entity";
import { VestingService } from "./vesting.service";
import { VestingSearchDto } from "./dto";

@Public()
@Controller("/vesting")
export class VestingController {
  constructor(private readonly vestingService: VestingService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: VestingSearchDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<[Array<ContractEntity>, number]> {
    return this.vestingService.search(dto, merchantEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ContractEntity | null> {
    return this.vestingService.findOne({ id });
  }
}
