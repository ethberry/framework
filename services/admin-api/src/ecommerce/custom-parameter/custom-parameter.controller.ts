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
import { PaginationInterceptor } from "@ethberry/nest-js-utils";

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
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: CustomParameterUpdateDto,
  ): Promise<CustomParameterEntity> {
    return this.customParameterService.update({ id }, dto);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.customParameterService.delete({ id });
  }
}
