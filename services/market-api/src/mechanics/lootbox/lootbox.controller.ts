import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";
import { IServerSignature } from "@gemunion/types-collection";

import { LootboxService } from "./lootbox.service";
import { LootboxEntity } from "./lootbox.entity";
import { LootboxSearchDto, SignLootboxDto } from "./dto";

@ApiBearerAuth()
@Controller("/lootboxes")
export class LootboxController {
  constructor(private readonly lootboxService: LootboxService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: LootboxSearchDto): Promise<[Array<LootboxEntity>, number]> {
    return this.lootboxService.search(dto);
  }

  @Post("/sign")
  public sign(@Body() dto: SignLootboxDto): Promise<IServerSignature> {
    return this.lootboxService.sign(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<LootboxEntity | null> {
    return this.lootboxService.findOneWithRelations({ id });
  }
}
