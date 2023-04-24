import { Body, Controller, Get, Param, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";

import { ParameterService } from "./parameter.service";
import { ParameterEntity } from "./parameter.entity";
import { ParameterUpdateDto } from "./dto";
import { ParameterEnumDto } from "./dto/enum";

@ApiBearerAuth()
@Controller("/parameter")
export class ParameterController {
  constructor(private readonly parameterService: ParameterService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(): Promise<[Array<ParameterEntity>, number]> {
    return this.parameterService.search();
  }

  @Get("/enum")
  public getEnum(@Query() dto: ParameterEnumDto): Promise<string[]> {
    return this.parameterService.getEnum(dto);
  }

  @Get("/names")
  public getNames(): Promise<string[]> {
    return this.parameterService.getNames();
  }

  @Put("/:id")
  public update(@Param("id") id: number, @Body() dto: ParameterUpdateDto): Promise<ParameterEntity> {
    return this.parameterService.update({ id }, dto);
  }
}
