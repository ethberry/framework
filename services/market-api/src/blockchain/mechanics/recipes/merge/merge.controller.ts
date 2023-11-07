import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";
import type { IServerSignature } from "@gemunion/types-blockchain";

import { MergeService } from "./merge.service";
import { MergeEntity } from "./merge.entity";
import { DismantleSignDto, MergeSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/recipes/merge")
export class MergeController {
  constructor(private readonly mergeService: MergeService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: MergeSearchDto): Promise<[Array<MergeEntity>, number]> {
    return this.mergeService.search(dto);
  }

  @Post("/sign")
  public sign(@Body() dto: DismantleSignDto): Promise<IServerSignature> {
    return this.mergeService.sign(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<MergeEntity | null> {
    return this.mergeService.findOneWithRelations({ id });
  }
}
