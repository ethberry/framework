import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { PyramidRulesService } from "./rules.service";
import { PyramidCreateDto, PyramidRuleSearchDto } from "./dto";
import { PyramidRulesEntity } from "./rules.entity";
import { PyramidUpdateDto } from "./dto/update";

@ApiBearerAuth()
@Controller("/pyramid/rules")
export class PyramidRulesController {
  constructor(private readonly pyramidService: PyramidRulesService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: PyramidRuleSearchDto): Promise<[Array<PyramidRulesEntity>, number]> {
    return this.pyramidService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<PyramidRulesEntity | null> {
    return this.pyramidService.findOneWithRelations({ id });
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: PyramidUpdateDto,
  ): Promise<PyramidRulesEntity | null> {
    return this.pyramidService.update({ id }, dto);
  }

  @Post("/")
  public create(@Body() dto: PyramidCreateDto): Promise<PyramidRulesEntity> {
    return this.pyramidService.create(dto);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.pyramidService.delete({ id });
  }
}
