import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { MysteryboxBoxService } from "./box.service";
import { MysteryboxBoxEntity } from "./box.entity";
import { MysteryboxCreateDto, MysteryboxSearchDto, MysteryboxUpdateDto } from "./dto";

@ApiBearerAuth()
@Controller("/mysterybox-boxes")
export class MysteryboxBoxController {
  constructor(private readonly mysteryboxService: MysteryboxBoxService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: MysteryboxSearchDto): Promise<[Array<MysteryboxBoxEntity>, number]> {
    return this.mysteryboxService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<MysteryboxBoxEntity>> {
    return this.mysteryboxService.autocomplete();
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: MysteryboxUpdateDto): Promise<MysteryboxBoxEntity> {
    return this.mysteryboxService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<MysteryboxBoxEntity | null> {
    return this.mysteryboxService.findOneWithRelations({ id });
  }

  @Post("/")
  public create(@Body() dto: MysteryboxCreateDto): Promise<MysteryboxBoxEntity> {
    return this.mysteryboxService.create(dto);
  }

  @Delete("/:id")
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<MysteryboxBoxEntity> {
    return this.mysteryboxService.delete({ id });
  }
}
