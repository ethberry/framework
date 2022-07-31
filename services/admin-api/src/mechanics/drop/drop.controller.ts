import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";
import { PaginationDto } from "@gemunion/collection";

import { DropService } from "./drop.service";
import { DropEntity } from "./drop.entity";
import { DropCreateDto, DropUpdateDto } from "./dto";

@ApiBearerAuth()
@Controller("/drop")
export class DropController {
  constructor(private readonly dropService: DropService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: PaginationDto): Promise<[Array<DropEntity>, number]> {
    return this.dropService.search(dto);
  }

  @Post("/")
  public create(@Body() dto: DropCreateDto): Promise<DropEntity> {
    return this.dropService.create(dto);
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: DropUpdateDto): Promise<DropEntity> {
    return this.dropService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<DropEntity | null> {
    return this.dropService.findOne({ id });
  }
}
