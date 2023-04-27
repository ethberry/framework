import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { SearchDto } from "@gemunion/collection";
import { PaginationInterceptor } from "@gemunion/nest-js-utils";

import { ParameterCreateDto, ParameterUpdateDto } from "./dto";
import { ParameterService } from "./parameter.service";
import { ParameterEntity } from "./parameter.entity";

@ApiBearerAuth()
@Controller("/parameter")
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

  @Put("/:id")
  public update(@Param("id") id: number, @Body() dto: ParameterUpdateDto): Promise<ParameterEntity> {
    return this.parameterService.update({ id }, dto);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id") id: number): Promise<void> {
    await this.parameterService.delete({ id });
  }
}
