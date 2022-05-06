import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { Erc721CollectionService } from "./collection.service";
import { Erc721CollectionEntity } from "./collection.entity";
import { Erc721CollectionSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/erc721-collections")
export class Erc721CollectionController {
  constructor(private readonly erc721CollectionService: Erc721CollectionService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc721CollectionSearchDto): Promise<[Array<Erc721CollectionEntity>, number]> {
    return this.erc721CollectionService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<Erc721CollectionEntity>> {
    return this.erc721CollectionService.autocomplete();
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<Erc721CollectionEntity | null> {
    return this.erc721CollectionService.findOne({ id });
  }
}
