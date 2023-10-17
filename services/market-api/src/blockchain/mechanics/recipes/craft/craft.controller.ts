import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, Public } from "@gemunion/nest-js-utils";
import type { IServerSignature } from "@gemunion/types-blockchain";
import type { ICraftCountResult } from "@framework/types";

import { CraftService } from "./craft.service";
import { CraftEntity } from "./craft.entity";
import { CraftCountDto, CraftSearchDto, CraftSignDto } from "./dto";

@Public()
@Controller("/recipes/craft")
export class CraftController {
  constructor(private readonly craftService: CraftService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: CraftSearchDto): Promise<[Array<CraftEntity>, number]> {
    return this.craftService.search(dto);
  }

  @Post("/count")
  public count(@Body() dto: CraftCountDto): Promise<ICraftCountResult> {
    return this.craftService.count(dto);
  }

  @Post("/sign")
  public sign(@Body() dto: CraftSignDto): Promise<IServerSignature> {
    return this.craftService.sign(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<CraftEntity | null> {
    return this.craftService.findOneWithRelations({ id });
  }
}
