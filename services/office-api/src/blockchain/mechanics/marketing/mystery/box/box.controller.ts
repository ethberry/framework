import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { MysteryBoxService } from "./box.service";
import { MysteryBoxEntity } from "./box.entity";
import { MysteryBoxCreateDto, MysteryBoxSearchDto, MysteryBoxUpdateDto } from "./dto";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { MysteryBoxAutocompleteDto } from "./dto/autocomplete";

@ApiBearerAuth()
@Controller("/mystery/boxes")
export class MysteryBoxController {
  constructor(private readonly mysteryBoxService: MysteryBoxService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: MysteryBoxSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<MysteryBoxEntity>, number]> {
    return this.mysteryBoxService.search(dto, userEntity);
  }

  @Get("/autocomplete")
  public autocomplete(
    @Query() dto: MysteryBoxAutocompleteDto,
    @User() userEntity: UserEntity,
  ): Promise<Array<MysteryBoxEntity>> {
    return this.mysteryBoxService.autocomplete(dto, userEntity);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: MysteryBoxUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<MysteryBoxEntity> {
    return this.mysteryBoxService.updateAll({ id }, dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<MysteryBoxEntity | null> {
    return this.mysteryBoxService.findOneWithRelations({ id });
  }

  @Post("/")
  public create(@Body() dto: MysteryBoxCreateDto, @User() userEntity: UserEntity): Promise<MysteryBoxEntity> {
    return this.mysteryBoxService.create(dto, userEntity);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number, @User() userEntity: UserEntity): Promise<void> {
    await this.mysteryBoxService.delete({ id }, userEntity);
  }
}
