import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { VestingService } from "./vesting.service";
import { VestingEntity } from "./vesting.entity";
import { VestingSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/vesting")
export class VestingController {
  constructor(private readonly vestingService: VestingService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: VestingSearchDto): Promise<[Array<VestingEntity>, number]> {
    return this.vestingService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<VestingEntity | null> {
    return this.vestingService.findOne({ id }, { relations: { contract: true } });
  }
}
