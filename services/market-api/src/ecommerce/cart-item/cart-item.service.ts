import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { CartItemEntity } from "./cart-item.entity";
import type { ICartItemCreateDto } from "./interfaces";
import { CartEntity } from "../cart/cart.entity";

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItemEntity)
    private readonly orderItemEntityRepository: Repository<CartItemEntity>,
  ) {}

  public create(data: ICartItemCreateDto, cartEntity: CartEntity): Promise<CartItemEntity> {
    return this.orderItemEntityRepository
      .create({
        ...data,
        cartId: cartEntity.id,
      })
      .save();
  }

  public delete(where: FindOptionsWhere<CartItemEntity>): Promise<DeleteResult> {
    return this.orderItemEntityRepository.delete(where);
  }

  public findOne(
    where: FindOptionsWhere<CartItemEntity>,
    options?: FindOneOptions<CartItemEntity>,
  ): Promise<CartItemEntity | null> {
    return this.orderItemEntityRepository.findOne({ where, ...options });
  }
}
