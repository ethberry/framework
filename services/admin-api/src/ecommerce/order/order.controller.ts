import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../../infrastructure/user/user.entity";
import { OrderCreateDto, OrderMoveDto, OrderSearchDto, OrderUpdateDto } from "./dto";
import { OrderService } from "./order.service";
import { OrderEntity } from "./order.entity";

@ApiBearerAuth()
@Controller("/ecommerce/orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: OrderSearchDto, @User() userEntity: UserEntity): Promise<[Array<OrderEntity>, number]> {
    return this.orderService.search(dto, userEntity);
  }

  @Post("/")
  public create(@Body() dto: OrderCreateDto, @User() userEntity: UserEntity): Promise<OrderEntity> {
    return this.orderService.create(dto, userEntity);
  }

  @Put("/:id")
  public update(@Param("id") id: number, @Body() dto: OrderUpdateDto): Promise<OrderEntity> {
    return this.orderService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id") id: number): Promise<OrderEntity | null> {
    return this.orderService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(204)
  public async delete(@Param("id") id: number): Promise<void> {
    await this.orderService.delete({ id });
  }

  @Post("/:id/move")
  @HttpCode(204)
  public async move(@Param("id") id: number, @Body() dto: OrderMoveDto): Promise<OrderEntity | undefined> {
    return this.orderService.move({ id }, dto);
  }
}
