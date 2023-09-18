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

import { AssetPromoService } from "./promo.service";
import { AssetPromoEntity } from "./promo.entity";
import { AssetPromoCreateDto, AssetPromoUpdateDto } from "./dto";
import { AssetPromoSearchDto } from "./dto/search";
import { UserEntity } from "../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/promos")
export class AssetPromoController {
  constructor(private readonly assetPromoService: AssetPromoService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: AssetPromoSearchDto): Promise<[Array<AssetPromoEntity>, number]> {
    return this.assetPromoService.search(dto);
  }

  @Post("/")
  public create(@Body() dto: AssetPromoCreateDto, @User() userEntity: UserEntity): Promise<AssetPromoEntity> {
    return this.assetPromoService.create(dto, userEntity);
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: AssetPromoUpdateDto): Promise<AssetPromoEntity> {
    return this.assetPromoService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<AssetPromoEntity | null> {
    return this.assetPromoService.findOneWithRelations({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.assetPromoService.delete({ id });
  }
}
