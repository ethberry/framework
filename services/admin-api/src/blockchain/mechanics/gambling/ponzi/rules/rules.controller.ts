import { Body, Controller, Get, Param, ParseIntPipe, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";
import { SearchableDto } from "@gemunion/collection";

import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { PonziRulesService } from "./rules.service";
import { PonziRulesEntity } from "./rules.entity";
import { PonziRuleAutocompleteDto, PonziRuleSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/ponzi/rules")
export class PonziRulesController {
  constructor(private readonly ponziRulesService: PonziRulesService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: PonziRuleSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<PonziRulesEntity>, number]> {
    return this.ponziRulesService.search(dto, userEntity);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: PonziRuleAutocompleteDto): Promise<Array<PonziRulesEntity>> {
    return this.ponziRulesService.autocomplete(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<PonziRulesEntity | null> {
    return this.ponziRulesService.findOneWithRelations({ id });
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: SearchableDto): Promise<PonziRulesEntity | null> {
    return this.ponziRulesService.update({ id }, dto);
  }
}
