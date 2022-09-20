import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { PyramidRulesService } from "./rules.service";
import { PyramidRulesEntity } from "./rules.entity";
import { PyramidRuleSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/pyramid/rules")
export class PyramidRulesController {
  constructor(private readonly pyramidService: PyramidRulesService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  public search(@Query() dto: PyramidRuleSearchDto): Promise<[Array<PyramidRulesEntity>, number]> {
    return this.pyramidService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<PyramidRulesEntity | null> {
    return this.pyramidService.findOneWithRelations({ id });
  }
}
