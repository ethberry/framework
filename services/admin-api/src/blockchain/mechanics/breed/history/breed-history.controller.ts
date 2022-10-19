import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";
import { PaginationDto } from "@gemunion/collection";

import { BreedHistoryService } from "./breed-history.service";
import { BreedHistoryEntity } from "./breed-history.entity";

@ApiBearerAuth()
@Controller("/breeds/history")
export class BreedHistoryController {
  constructor(private readonly breedService: BreedHistoryService) {}

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<BreedHistoryEntity>> {
    return this.breedService.autocomplete();
  }

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public searchHistory(@Query() dto: PaginationDto): Promise<[Array<BreedHistoryEntity>, number]> {
    return this.breedService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOneBreedHistory(@Param("id", ParseIntPipe) id: number): Promise<BreedHistoryEntity | null> {
    return this.breedService.findOneWithRelations({ id });
  }
}
