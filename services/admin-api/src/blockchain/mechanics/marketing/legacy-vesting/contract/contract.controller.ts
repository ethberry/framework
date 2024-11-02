import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@ethberry/nest-js-utils";

import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";
import { LegacyVestingService } from "./contract.service";
import { LegacyVestingContractSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/legacy-vesting/contracts")
export class LegacyVestingController {
  constructor(private readonly legacyVestingService: LegacyVestingService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: LegacyVestingContractSearchDto): Promise<[Array<ContractEntity>, number]> {
    return this.legacyVestingService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ContractEntity | null> {
    return this.legacyVestingService.findOne({ id });
  }
}
