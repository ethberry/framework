import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { OrderService } from "./order.service";
import { OrderEntity } from "./order.entity";
import { OrderCreateDto, OrderSearchDto, OrderUpdateDto } from "./dto";
import { UserEntity } from "../user/user.entity";

@ApiBearerAuth()
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
