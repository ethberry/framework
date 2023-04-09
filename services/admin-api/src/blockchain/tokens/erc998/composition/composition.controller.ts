import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { Erc998CompositionService } from "./composition.service";
import { CompositionEntity } from "./composition.entity";
import { CompositionSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/erc998/composition")
export class Erc998CompositionController {
  constructor(private readonly erc998CompositionService: Erc998CompositionService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: CompositionSearchDto): Promise<[Array<CompositionEntity>, number]> {
    return this.erc998CompositionService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<CompositionEntity | null> {
    return this.erc998CompositionService.findOne({ id }, { relations: { parent: true, child: true } });
  }
}
