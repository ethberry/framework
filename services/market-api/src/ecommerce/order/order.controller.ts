import { Request, Response } from "express";
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, Req, Res, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { OrderService } from "./order.service";
import { OrderEntity } from "./order.entity";
import { OrderCreateDto, OrderSearchDto } from "./dto";
import { UserEntity } from "../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: OrderSearchDto): Promise<[Array<OrderEntity>, number]> {
    return this.orderService.search(dto);
  }

  @Post("/user")
  public createForUser(
    @Body() dto: OrderCreateDto,
    @User() userEntity: UserEntity,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    return this.orderService.createForUser(dto, userEntity, req, res);
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
}
