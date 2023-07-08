import { Body, Controller, Get, Param, ParseIntPipe, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";
import { SearchableDto } from "@gemunion/collection";

import { StakingRulesService } from "./rules.service";
import { StakingRulesEntity } from "./rules.entity";
import { StakingRuleAutocompleteDto, StakingRuleSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/staking/rules")
export class StakingRulesController {
  constructor(private readonly stakingRulesService: StakingRulesService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: StakingRuleSearchDto): Promise<[Array<StakingRulesEntity>, number]> {
    return this.stakingRulesService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: StakingRuleAutocompleteDto): Promise<Array<StakingRulesEntity>> {
    return this.stakingRulesService.autocomplete(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<StakingRulesEntity | null> {
    return this.stakingRulesService.findOneWithRelations({ id });
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: SearchableDto): Promise<StakingRulesEntity | null> {
    return this.stakingRulesService.update({ id }, dto);
  }
}
