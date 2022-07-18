import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { LootboxService } from "./lootbox.service";
import { LootboxEntity } from "./lootbox.entity";
import { LootboxCreateDto, LootboxSearchDto, LootboxUpdateDto } from "./dto";

@ApiBearerAuth()
@Controller("/lootboxes")
export class LootboxController {
  constructor(private readonly lootboxService: LootboxService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: LootboxSearchDto): Promise<[Array<LootboxEntity>, number]> {
    return this.lootboxService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<LootboxEntity>> {
    return this.lootboxService.autocomplete();
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: LootboxUpdateDto): Promise<LootboxEntity> {
    return this.lootboxService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<LootboxEntity | null> {
    return this.lootboxService.findOneWithPrice({ id });
  }

  @Post("/")
  public create(@Body() dto: LootboxCreateDto): Promise<LootboxEntity> {
    return this.lootboxService.create(dto);
  }

  @Delete("/:id")
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<LootboxEntity> {
    return this.lootboxService.delete({ id });
  }
}
