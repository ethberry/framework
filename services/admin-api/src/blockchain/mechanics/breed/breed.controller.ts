import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { NotFoundInterceptor, PaginationInterceptor, Public } from "@gemunion/nest-js-utils";

import { PaginationDto } from "@gemunion/collection";

import { BreedService } from "./breed.service";
import { BreedEntity } from "./breed.entity";

@Public()
@Controller("/breed/breeds")
export class BreedController {
  constructor(private readonly breedService: BreedService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: PaginationDto): Promise<[Array<BreedEntity>, number]> {
    return this.breedService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOneBreed(@Param("id", ParseIntPipe) id: number): Promise<BreedEntity | null> {
    return this.breedService.findOneWithRelations({ id });
  }
}
