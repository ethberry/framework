import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";
import { IServerSignature } from "@gemunion/types-collection";

import { MysteryboxService } from "./mysterybox.service";
import { MysteryboxEntity } from "./mysterybox.entity";
import { MysteryboxSearchDto, SignMysteryboxDto } from "./dto";

@ApiBearerAuth()
@Controller("/mysteryboxes")
export class MysteryboxController {
  constructor(private readonly mysteryboxService: MysteryboxService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: MysteryboxSearchDto): Promise<[Array<MysteryboxEntity>, number]> {
    return this.mysteryboxService.search(dto);
  }

  @Post("/sign")
  public sign(@Body() dto: SignMysteryboxDto): Promise<IServerSignature> {
    return this.mysteryboxService.sign(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<MysteryboxEntity | null> {
    return this.mysteryboxService.findOneWithRelations({ id });
  }
}
