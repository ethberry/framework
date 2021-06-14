import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseInterceptors} from "@nestjs/common";
import {ApiCookieAuth} from "@nestjs/swagger";

import {NotFoundInterceptor, PaginationInterceptor} from "@trejgun/nest-js-providers";

import {MerchantService} from "./merchant.service";
import {MerchantEntity} from "./merchant.entity";
import {MerchantCreateSchema, MerchantSearchSchema, MerchantUpdateSchema} from "./schemas";
import {Roles, User} from "../common/decorators";
import {UserEntity} from "../user/user.entity";
import {UserRole} from "@trejgun/solo-types";

@ApiCookieAuth()
@Controller("/merchants")
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() query: MerchantSearchSchema): Promise<[Array<MerchantEntity>, number]> {
    return this.merchantService.search(query);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<MerchantEntity>> {
    return this.merchantService.autocomplete();
  }

  @Post("/")
  public create(@Body() body: MerchantCreateSchema, @User() userEntity: UserEntity): Promise<MerchantEntity> {
    return this.merchantService.create(body, userEntity);
  }

  @Put("/:id")
  public update(
    @Param("id") id: number,
    @Body() body: MerchantUpdateSchema,
    @User() userEntity: UserEntity,
  ): Promise<MerchantEntity | undefined> {
    return this.merchantService.update({id}, body, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id") id: number): Promise<MerchantEntity | undefined> {
    return this.merchantService.findOne({id});
  }

  @Delete("/:id")
  @Roles(UserRole.ADMIN)
  @HttpCode(204)
  public async delete(@Param("id") id: number, @User() userEntity: UserEntity): Promise<void> {
    await this.merchantService.delete({id}, userEntity);
  }
}
