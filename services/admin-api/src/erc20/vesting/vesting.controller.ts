import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { Erc20VestingService } from "./vesting.service";
import { Erc20VestingEntity } from "./vesting.entity";
import { Erc20VestingSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/erc20-vesting")
export class Erc20VestingController {
  constructor(private readonly erc20VestingService: Erc20VestingService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc20VestingSearchDto): Promise<[Array<Erc20VestingEntity>, number]> {
    return this.erc20VestingService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<Erc20VestingEntity | null> {
    return this.erc20VestingService.findOne({ id }, { relations: { erc20Token: true } });
  }
}
