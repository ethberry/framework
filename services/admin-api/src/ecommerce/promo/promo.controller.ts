import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from "@nestjs/common";

import { PaginationInterceptor, Public, Roles } from "@gemunion/nest-js-utils";

import { UserRole } from "@framework/types";

import { PromoService } from "./promo.service";
import { PromoEntity } from "./promo.entity";
import { PromoCreateDto, PromoSearchDto, PromoUpdateDto } from "./dto";

@Public()
@Roles(UserRole.ADMIN)
@Controller("/ecommerce/promos")
export class PromoController {
  constructor(private readonly promoService: PromoService) {}

  @Public()
  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: PromoSearchDto): Promise<[Array<PromoEntity>, number]> {
    return this.promoService.search(dto);
  }

  @Post("/")
  public create(@Body() dto: PromoCreateDto): Promise<PromoEntity> {
    return this.promoService.create(dto);
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: PromoUpdateDto): Promise<PromoEntity | undefined> {
    return this.promoService.update({ id }, dto);
  }

  @Delete("/:id")
  @HttpCode(204)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.promoService.delete({ id });
  }
}
