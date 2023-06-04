import { Request, Response } from "express";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from "typeorm";

import { OrderStatus } from "@framework/types";

import { OrderEntity } from "./order.entity";
import { IOrderCreateDto, IOrderSearchDto } from "./interfaces";
import { UserEntity } from "../../infrastructure/user/user.entity";
import { AddressService } from "../address/address.service";
import { CartService } from "../cart/cart.service";
import { UserService } from "../../infrastructure/user/user.service";
import { AuthService } from "../../infrastructure/auth/auth.service";
import { ProductService } from "../product/product.service";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderEntityRepository: Repository<OrderEntity>,
    private readonly addressService: AddressService,
    private readonly cartService: CartService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly productService: ProductService,
  ) {}

  public findAndCount(
    where: FindOptionsWhere<OrderEntity>,
    options?: FindManyOptions<OrderEntity>,
  ): Promise<[Array<OrderEntity>, number]> {
    return this.orderEntityRepository.findAndCount({ where, order: { createdAt: "DESC" }, ...options });
  }

  public search({ orderStatus, dateRange }: IOrderSearchDto): Promise<[Array<OrderEntity>, number]> {
    const queryBuilder = this.orderEntityRepository.createQueryBuilder("order").select();

    if (orderStatus && orderStatus.length) {
      if (orderStatus.length === 1) {
        queryBuilder.andWhere("order.orderStatus = :orderStatus", { orderStatus: orderStatus[0] });
      } else {
        queryBuilder.andWhere("order.orderStatus IN(:...orderStatus)", { orderStatus });
      }
    }

    if (dateRange) {
      const [begin, end] = dateRange.split("/");
      queryBuilder.andWhere("order.createdAt BETWEEN :begin AND :end", { begin, end });
    }

    queryBuilder.leftJoinAndSelect("order.items", "items");
    queryBuilder.leftJoinAndSelect("order.address", "address");
    queryBuilder.leftJoinAndSelect("items.product", "product");
    queryBuilder.orderBy("order.createdAt", "DESC");
    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<OrderEntity>,
    options?: FindOneOptions<OrderEntity>,
  ): Promise<OrderEntity | null> {
    return this.orderEntityRepository.findOne({ where, ...options });
  }

  public async createForUser(
    data: IOrderCreateDto,
    userEntity: UserEntity,
    req: Request,
    res: Response,
  ): Promise<void> {
    const addressEntity = await this.addressService.findOne({ id: data.addressId, userId: userEntity.id });

    if (!addressEntity) {
      throw new NotFoundException("addressNotFound");
    }

    // @ts-ignore
    const cartEntity = await this.cartService.findOne({ sessionId: req.sessionID });

    if (!cartEntity || !cartEntity.items.length) {
      throw new NotFoundException("cartNotFound");
    }

    const orderEntity = await this.orderEntityRepository
      .create({
        user: userEntity,
        orderStatus: OrderStatus.NEW,
        orderItems: cartEntity.items,
        address: addressEntity,
      })
      .save();

    res.json(orderEntity);
  }

  public delete(where: FindOptionsWhere<OrderEntity>): Promise<UpdateResult> {
    return this.orderEntityRepository.update(where, { orderStatus: OrderStatus.CANCELED });
  }
}
