import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from "@nestjs/common";
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
  public search(@Query() dto: OrderSearchDto, @User() userEntity: UserEntity): Promise<[Array<OrderEntity>, number]> {
    return this.orderService.search(dto, userEntity);
  }

  @Post("/")
  public create(@Body() dto: OrderCreateDto): Promise<OrderEntity> {
    return this.orderService.create(dto);
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
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id") id: number): Promise<void> {
    await this.orderService.delete({ id });
  }
}
