import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { NotFoundInterceptor, PaginationInterceptor, Public } from "@gemunion/nest-js-utils";

import { PaginationDto } from "@gemunion/collection";

import { BreedService } from "./breed.service";
import { BreedEntity } from "./breed.entity";
import { BreedHistoryEntity } from "./history.entity";
import { LotteryRoundEntity } from "../lottery/round/round.entity";

// TODO divide to modules - breed & history;
@Public()
@Controller("/breed")
export class BreedController {
  constructor(private readonly breedService: BreedService) {}

  @Get("/breeds/")
  @UseInterceptors(PaginationInterceptor)
  public searchBreed(@Query() dto: PaginationDto): Promise<[Array<BreedEntity>, number]> {
    return this.breedService.searchBreed(dto);
  }

  @Get("/history/autocomplete")
  public autocomplete(): Promise<Array<BreedHistoryEntity>> {
    return this.breedService.autocompleteHistory();
  }

  @Get("/history/")
  @UseInterceptors(PaginationInterceptor)
  public searchHistory(@Query() dto: PaginationDto): Promise<[Array<BreedHistoryEntity>, number]> {
    return this.breedService.searchHistory(dto);
  }

  @Get("/breeds/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOneBreed(@Param("id", ParseIntPipe) id: number): Promise<BreedEntity | null> {
    return this.breedService.findOneWithRelationsBreed({ id });
  }

  @Get("/history/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOneBreedHistory(@Param("id", ParseIntPipe) id: number): Promise<BreedHistoryEntity | null> {
    return this.breedService.findOneWithRelationsHistory({ id });
  }
}
