import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { CartEntity } from "./cart.entity";
import { CartItemService } from "../cart-item/cart-item.service";
import { ICartItemCreateDto } from "../cart-item/interfaces";
import { ICartUpdateDto } from "./interfaces";
import { CartItemEntity } from "../cart-item/cart-item.entity";
import { UserEntity } from "../../infrastructure/user/user.entity";

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartEntityRepository: Repository<CartEntity>,
    private readonly cartItemService: CartItemService,
  ) {}

  public async find(userEntity: UserEntity): Promise<CartEntity> {
    return this.getCartOrCreate(userEntity);
  }

  public async update(data: ICartUpdateDto, userEntity: UserEntity): Promise<CartEntity> {
    const cartEntity = await this.getCartOrCreate(userEntity);

    // remove old
    await Promise.allSettled(
      cartEntity.items
        .filter(oldItem => !data.items.find(newItem => newItem.productItemId === oldItem.productItemId))
        .map(oldItem => oldItem.remove()),
    );

    // change existing
    const changedItems = await Promise.allSettled(
      cartEntity.items
        .filter(oldItem => data.items.find(newItem => newItem.productItemId === oldItem.productItemId))
        .map(oldItem => {
          oldItem.quantity = data.items.find(newItem => newItem.productItemId === oldItem.productItemId)!.quantity;
          return oldItem.save();
        }),
    ).then(values =>
      values
        .filter(c => c.status === "fulfilled")
        .map(c => <PromiseFulfilledResult<CartItemEntity>>c)
        .map(c => c.value),
    );

    // add new
    const newItems = await Promise.allSettled(
      data.items
        .filter(newItem => !cartEntity.items.find(oldItem => newItem.productItemId === oldItem.productItemId))
        .map(newItem => this.cartItemService.create(newItem, cartEntity)),
    ).then(values =>
      values
        .filter(c => c.status === "fulfilled")
        .map(c => <PromiseFulfilledResult<CartItemEntity>>c)
        .map(c => c.value),
    );

    Object.assign(cartEntity, { items: [...changedItems, ...newItems] });
    return cartEntity.save();
  }

  public async alter(data: ICartItemCreateDto, userEntity: UserEntity): Promise<CartEntity> {
    const cartEntity = await this.getCartOrCreate(userEntity);

    const index = cartEntity.items.findIndex(item => item.productItemId === data.productItemId);

    if (index !== -1) {
      if (data.quantity === 0) {
        await cartEntity.items[index].remove();
        cartEntity.items.splice(index, 1);
      } else {
        cartEntity.items[index].quantity = data.quantity;
        await cartEntity.items[index].save();
      }
    } else {
      const cartItemEntity = await this.cartItemService.create(data, cartEntity);
      cartEntity.items.push(cartItemEntity);
    }

    return cartEntity.save();
  }

  public async getCartOrCreate(userEntity: UserEntity): Promise<CartEntity> {
    const cartEntity = await this.findOne({ userId: userEntity.id });

    if (cartEntity) {
      return cartEntity;
    }

    return this.cartEntityRepository
      .create({
        user: userEntity,
        items: [],
      })
      .save();
  }

  public findOne(
    where: FindOptionsWhere<CartEntity>,
    options?: FindOneOptions<CartEntity>,
  ): Promise<CartEntity | null> {
    return this.cartEntityRepository.findOne({ where, ...options });
  }
}
