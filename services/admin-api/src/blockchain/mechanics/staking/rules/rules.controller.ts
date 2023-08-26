import { Body, Controller, Get, Param, ParseIntPipe, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";
import { SearchableOptionalDto } from "@gemunion/collection";

import { StakingRulesService } from "./rules.service";
import { StakingRulesEntity } from "./rules.entity";
import { StakingRuleAutocompleteDto, StakingRuleSearchDto } from "./dto";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/staking/rules")
export class StakingRulesController {
  constructor(private readonly stakingRulesService: StakingRulesService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: StakingRuleSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<StakingRulesEntity>, number]> {
    return this.stakingRulesService.search(dto, userEntity);
  }

  @Get("/autocomplete")
  public autocomplete(
    @Query() dto: StakingRuleAutocompleteDto,
    @User() userEntity: UserEntity,
  ): Promise<Array<StakingRulesEntity>> {
    return this.stakingRulesService.autocomplete(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<StakingRulesEntity | null> {
    return this.stakingRulesService.findOneWithRelations({ id });
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: SearchableOptionalDto,
    @User() userEntity: UserEntity,
  ): Promise<StakingRulesEntity | null> {
    return this.stakingRulesService.update({ id }, dto, userEntity);
  }
}
