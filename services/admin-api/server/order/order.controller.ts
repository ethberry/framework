import { Controller, Get, Post, Put, Query, Body, UseInterceptors, Param, Delete, HttpCode } from "@nestjs/common";
import { ApiCookieAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunionstudio/nest-js-utils";

import { OrderService } from "./order.service";
import { OrderEntity } from "./order.entity";
import { OrderSearchDto, OrderCreateDto, OrderUpdateDto } from "./dto";
import { User } from "../common/decorators";
import { UserEntity } from "../user/user.entity";

@ApiCookieAuth()
@Controller("/orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() query: OrderSearchDto, @User() userEntity: UserEntity): Promise<[Array<OrderEntity>, number]> {
    return this.orderService.search(query, userEntity);
  }

  @Post("/")
  public create(@Body() body: OrderCreateDto): Promise<OrderEntity> {
    return this.orderService.create(body);
  }

  @Put("/:id")
  public update(@Param("id") id: number, @Body() body: OrderUpdateDto): Promise<OrderEntity> {
    return this.orderService.update({ id }, body);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id") id: number): Promise<OrderEntity | undefined> {
    return this.orderService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(204)
  public async delete(@Param("id") id: number): Promise<void> {
    await this.orderService.delete({ id });
  }
}
