import { Body, Controller, Get, Param, ParseIntPipe, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { StakingRulesService } from "./rules.service";
import { StakingRuleSearchDto, StakingRuleUpdateDto } from "./dto";
import { StakingRulesEntity } from "./rules.entity";

@ApiBearerAuth()
@Controller("/staking/rules")
export class StakingRulesController {
  constructor(private readonly stakingService: StakingRulesService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: StakingRuleSearchDto): Promise<[Array<StakingRulesEntity>, number]> {
    return this.stakingService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<StakingRulesEntity | null> {
    return this.stakingService.findOneWithRelations({ id });
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: StakingRuleUpdateDto,
  ): Promise<StakingRulesEntity | null> {
    return this.stakingService.update({ id }, dto);
  }
}