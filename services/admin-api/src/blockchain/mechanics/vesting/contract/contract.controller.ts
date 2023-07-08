import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { VestingService } from "./contract.service";
import { VestingContractSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/vesting/contracts")
export class VestingController {
  constructor(private readonly vestingService: VestingService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: VestingContractSearchDto): Promise<[Array<ContractEntity>, number]> {
    return this.vestingService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ContractEntity | null> {
    return this.vestingService.findOne({ id });
  }
}
