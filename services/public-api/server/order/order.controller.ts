import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, UseInterceptors } from "@nestjs/common";
import { ApiCookieAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunionstudio/nest-js-utils";

import { OrderService } from "./order.service";
import { OrderEntity } from "./order.entity";
import { OrderCreateDto, OrderSearchDto } from "./dto";
import { UserEntity } from "../user/user.entity";
import { User } from "../common/decorators";

@ApiCookieAuth()
@Controller("/orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() query: OrderSearchDto): Promise<[Array<OrderEntity>, number]> {
    return this.orderService.search(query);
  }

  @Post("/user")
  public create(@Body() body: OrderCreateDto, @User() userEntity: UserEntity): Promise<OrderEntity> {
    return this.orderService.create(body, userEntity);
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
