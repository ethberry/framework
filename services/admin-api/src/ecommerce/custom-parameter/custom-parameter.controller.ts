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

import { CustomParameterCreateDto, CustomParameterUpdateDto } from "./dto";
import { CustomParameterService } from "./custom-parameter.service";
import { CustomParameterEntity } from "./custom-parameter.entity";

@ApiBearerAuth()
@Controller("/ecommerce/custom-parameter")
export class CustomParameterController {
  constructor(private readonly customParameterService: CustomParameterService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: SearchDto): Promise<[Array<CustomParameterEntity>, number]> {
    return this.customParameterService.search(dto);
  }

  @Post("/")
  public create(@Body() dto: CustomParameterCreateDto): Promise<CustomParameterEntity> {
    return this.customParameterService.create(dto);
  }

  @Put("/:id")
  public update(@Param("id") id: number, @Body() dto: CustomParameterUpdateDto): Promise<CustomParameterEntity> {
    return this.customParameterService.update({ id }, dto);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id") id: number): Promise<void> {
    await this.customParameterService.delete({ id });
  }
}
