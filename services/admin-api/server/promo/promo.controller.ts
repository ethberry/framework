import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseInterceptors} from "@nestjs/common";

import {PaginationInterceptor, Public, Roles} from "@gemunionstudio/nest-js-providers";

import {UserRole} from "@gemunionstudio/framework-types";

import {PromoService} from "./promo.service";
import {PromoEntity} from "./promo.entity";
import {PromoCreateDto, PromoSearchDto, PromoUpdateDto} from "./dto";

@Public()
@Roles(UserRole.ADMIN)
@Controller("/promos")
export class PromoController {
  constructor(private readonly promoService: PromoService) {}

  @Public()
  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() query: PromoSearchDto): Promise<[Array<PromoEntity>, number]> {
    return this.promoService.search(query);
  }

  @Post("/")
  public create(@Body() body: PromoCreateDto): Promise<PromoEntity> {
    return this.promoService.create(body);
  }

  @Put("/:id")
  public update(@Param("id") id: number, @Body() body: PromoUpdateDto): Promise<PromoEntity | undefined> {
    return this.promoService.update({id}, body);
  }

  @Delete("/:id")
  @HttpCode(204)
  public async delete(@Param("id") id: number): Promise<void> {
    await this.promoService.delete({id});
  }
}
