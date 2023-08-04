import { Body, Controller, Get, Param, ParseIntPipe, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";
import { SearchableDto } from "@gemunion/collection";

import { PyramidRulesService } from "./rules.service";
import { PyramidRulesEntity } from "./rules.entity";
import { PyramidRuleAutocompleteDto, PyramidRuleSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/pyramid/rules")
export class PyramidRulesController {
  constructor(private readonly pyramidRulesService: PyramidRulesService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: PyramidRuleSearchDto): Promise<[Array<PyramidRulesEntity>, number]> {
    return this.pyramidRulesService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: PyramidRuleAutocompleteDto): Promise<Array<PyramidRulesEntity>> {
    return this.pyramidRulesService.autocomplete(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<PyramidRulesEntity | null> {
    return this.pyramidRulesService.findOneWithRelations({ id });
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: SearchableDto): Promise<PyramidRulesEntity | null> {
    return this.pyramidRulesService.update({ id }, dto);
  }
}
