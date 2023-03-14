import { Body, Controller, Get, Put } from "@nestjs/common";

import { Public, User } from "@gemunion/nest-js-utils";

import { CartItemCreateDto } from "../cart-item/dto";
import { CartUpdateDto } from "./dto";
import { CartService } from "./cart.service";
import { CartEntity } from "./cart.entity";
import { UserEntity } from "../../infrastructure/user/user.entity";

@Public()
@Controller("/cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get("/")
  public get(@User() userEntity: UserEntity): Promise<CartEntity> {
    return this.cartService.find(userEntity);
  }

  @Put("/")
  public update(@Body() dto: CartUpdateDto, @User() userEntity: UserEntity): Promise<CartEntity> {
    return this.cartService.update(dto, userEntity);
  }

  @Put("/alter")
  public alter(@Body() dto: CartItemCreateDto, @User() userEntity: UserEntity): Promise<CartEntity> {
    return this.cartService.alter(dto, userEntity);
  }
}
