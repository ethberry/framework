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

import { SearchDto } from "@ethberry/collection";
import { NotFoundInterceptor, PaginationInterceptor } from "@ethberry/nest-js-utils";

import { ParameterCreateDto, ParameterUpdateDto } from "./dto";
import { ParameterService } from "./parameter.service";
import { ParameterEntity } from "./parameter.entity";

@ApiBearerAuth()
@Controller("/ecommerce/parameters")
export class ParameterController {
  constructor(private readonly parameterService: ParameterService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: SearchDto): Promise<[Array<ParameterEntity>, number]> {
    return this.parameterService.search(dto);
  }

  @Post("/")
  public create(@Body() dto: ParameterCreateDto): Promise<ParameterEntity> {
    return this.parameterService.create(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ParameterEntity | null> {
    return this.parameterService.findOne({ id });
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: ParameterUpdateDto): Promise<ParameterEntity> {
    return this.parameterService.update({ id }, dto);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.parameterService.delete({ id });
  }
}
