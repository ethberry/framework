import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { MysteryBoxService } from "./box.service";
import { MysteryBoxEntity } from "./box.entity";
import { MysteryboxCreateDto, MysteryboxSearchDto, MysteryboxUpdateDto } from "./dto";
import { UserEntity } from "../../../../user/user.entity";

@ApiBearerAuth()
@Controller("/mystery-boxes")
export class MysteryBoxController {
  constructor(private readonly mysteryboxService: MysteryBoxService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: MysteryboxSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<MysteryBoxEntity>, number]> {
    return this.mysteryboxService.search(dto, userEntity);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<MysteryBoxEntity>> {
    return this.mysteryboxService.autocomplete();
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: MysteryboxUpdateDto): Promise<MysteryBoxEntity> {
    return this.mysteryboxService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<MysteryBoxEntity | null> {
    return this.mysteryboxService.findOneWithRelations({ id });
  }

  @Post("/")
  public create(@Body() dto: MysteryboxCreateDto): Promise<MysteryBoxEntity> {
    return this.mysteryboxService.create(dto);
  }

  @Delete("/:id")
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<MysteryBoxEntity> {
    return this.mysteryboxService.delete({ id });
  }
}
