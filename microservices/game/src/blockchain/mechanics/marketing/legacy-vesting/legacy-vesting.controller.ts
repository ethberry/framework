import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, Public, User } from "@ethberry/nest-js-utils";

import { MerchantEntity } from "../../../../infrastructure/merchant/merchant.entity";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { LegacyVestingService } from "./legacy-vesting.service";
import { LegacyVestingContractSearchDto } from "./dto";

@Public()
@Controller("/legacy-vesting")
export class LegacyVestingController {
  constructor(private readonly legacyVestingService: LegacyVestingService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: LegacyVestingContractSearchDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<[Array<ContractEntity>, number]> {
    return this.legacyVestingService.search(dto, merchantEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ContractEntity | null> {
    return this.legacyVestingService.findOne({ id });
  }
}
