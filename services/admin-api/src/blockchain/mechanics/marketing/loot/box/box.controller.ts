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

import { LootBoxService } from "./box.service";
import { LootBoxEntity } from "./box.entity";
import { LootBoxCreateDto, LootBoxSearchDto, LootBoxUpdateDto } from "./dto";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { LootBoxAutocompleteDto } from "./dto/autocomplete";

@ApiBearerAuth()
@Controller("/loot/boxes")
export class LootBoxController {
  constructor(private readonly lootboxService: LootBoxService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: LootBoxSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<LootBoxEntity>, number]> {
    return this.lootboxService.search(dto, userEntity);
  }

  @Get("/autocomplete")
  public autocomplete(
    @Query() dto: LootBoxAutocompleteDto,
    @User() userEntity: UserEntity,
  ): Promise<Array<LootBoxEntity>> {
    return this.lootboxService.autocomplete(dto, userEntity);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: LootBoxUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<LootBoxEntity> {
    return this.lootboxService.updateAll({ id }, dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<LootBoxEntity | null> {
    return this.lootboxService.findOneWithRelations({ id });
  }

  @Post("/")
  public create(@Body() dto: LootBoxCreateDto, @User() userEntity: UserEntity): Promise<LootBoxEntity> {
    return this.lootboxService.create(dto, userEntity);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number, @User() userEntity: UserEntity): Promise<void> {
    await this.lootboxService.delete({ id }, userEntity);
  }
}
