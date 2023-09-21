import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, Public } from "@gemunion/nest-js-utils";
import type { IServerSignature } from "@gemunion/types-blockchain";

import { DismantleService } from "./dismantle.service";
import { DismantleEntity } from "./dismantle.entity";
import { DismantleSearchDto, DismantleSignDto } from "./dto";

@Public()
@Controller("/recipes/dismantle")
export class DismantleController {
  constructor(private readonly dismantleService: DismantleService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: DismantleSearchDto): Promise<[Array<DismantleEntity>, number]> {
    return this.dismantleService.search(dto);
  }

  @Post("/sign")
  public sign(@Body() dto: DismantleSignDto): Promise<IServerSignature> {
    return this.dismantleService.sign(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<DismantleEntity | null> {
    return this.dismantleService.findOneWithRelations({ id });
  }
}
