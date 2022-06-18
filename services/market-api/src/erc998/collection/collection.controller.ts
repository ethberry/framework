import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { Erc998CollectionService } from "./collection.service";
import { Erc998CollectionEntity } from "./collection.entity";
import { Erc998CollectionSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/erc998-collections")
export class Erc998CollectionController {
  constructor(private readonly erc998CollectionService: Erc998CollectionService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc998CollectionSearchDto): Promise<[Array<Erc998CollectionEntity>, number]> {
    return this.erc998CollectionService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<Erc998CollectionEntity>> {
    return this.erc998CollectionService.autocomplete();
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<Erc998CollectionEntity | null> {
    return this.erc998CollectionService.findOne({ id });
  }
}
