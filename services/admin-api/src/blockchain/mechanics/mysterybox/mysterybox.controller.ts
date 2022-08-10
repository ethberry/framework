import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { MysteryboxService } from "./mysterybox.service";
import { MysteryboxEntity } from "./mysterybox.entity";
import { MysteryboxCreateDto, MysteryboxSearchDto, MysteryboxUpdateDto } from "./dto";

@ApiBearerAuth()
@Controller("/mysteryboxes")
export class MysteryboxController {
  constructor(private readonly mysteryboxService: MysteryboxService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: MysteryboxSearchDto): Promise<[Array<MysteryboxEntity>, number]> {
    return this.mysteryboxService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<MysteryboxEntity>> {
    return this.mysteryboxService.autocomplete();
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: MysteryboxUpdateDto): Promise<MysteryboxEntity> {
    return this.mysteryboxService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<MysteryboxEntity | null> {
    return this.mysteryboxService.findOneWithRelations({ id });
  }

  @Post("/")
  public create(@Body() dto: MysteryboxCreateDto): Promise<MysteryboxEntity> {
    return this.mysteryboxService.create(dto);
  }

  @Delete("/:id")
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<MysteryboxEntity> {
    return this.mysteryboxService.delete({ id });
  }
}
