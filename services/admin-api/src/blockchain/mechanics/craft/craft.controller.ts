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

import { CraftService } from "./craft.service";
import { CraftEntity } from "./craft.entity";
import { CraftSearchDto, CraftUpdateDto, CraftCreateDto } from "./dto";

@ApiBearerAuth()
@Controller("/craft")
export class CraftController {
  constructor(private readonly craftService: CraftService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: CraftSearchDto): Promise<[Array<CraftEntity>, number]> {
    return this.craftService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<CraftEntity | null> {
    return this.craftService.findOneWithRelations({ id });
  }

  @Post("/")
  public create(@Body() dto: CraftCreateDto): Promise<CraftEntity> {
    return this.craftService.create(dto);
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: CraftUpdateDto): Promise<CraftEntity> {
    return this.craftService.update({ id }, dto);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.craftService.delete({ id });
  }
}
