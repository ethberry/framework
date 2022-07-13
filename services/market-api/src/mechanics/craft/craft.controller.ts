import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, Public } from "@gemunion/nest-js-utils";
import { SearchDto } from "@gemunion/collection";

import { CraftService } from "./craft.service";
import { CraftEntity } from "./craft.entity";

@Public()
@Controller("/craft")
export class CraftController {
  constructor(private readonly craftService: CraftService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: SearchDto): Promise<[Array<CraftEntity>, number]> {
    return this.craftService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<CraftEntity | null> {
    return this.craftService.findOne({ id });
  }
}
