import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { IOrderSearchDto } from "@framework/types";

import { UserEntity } from "../../infrastructure/user/user.entity";
import { OrderItemService } from "../order-item/order-item.service";
import type { IOrderCreateDto, IOrderMoveDto, IOrderUpdateDto } from "./interfaces";
import { OrderEntity } from "./order.entity";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderEntityRepository: Repository<OrderEntity>,
    private readonly orderItemService: OrderItemService,
  ) {}

  public async search(dto: Partial<IOrderSearchDto>, userEntity: UserEntity): Promise<[Array<OrderEntity>, number]> {
    const { orderStatus, dateRange, isArchived } = dto;
    const queryBuilder = this.orderEntityRepository.createQueryBuilder("order").select();

    queryBuilder.leftJoinAndSelect("order.orderItems", "orderItems");
    queryBuilder.leftJoinAndSelect("order.address", "address");
    queryBuilder.leftJoinAndSelect("order.merchant", "merchant");
    queryBuilder.leftJoinAndSelect("orderItems.productItem", "productItems");
    queryBuilder.leftJoinAndSelect("productItems.product", "product");

    queryBuilder.select();

    queryBuilder.andWhere("order.merchantId = :merchantId", { merchantId: userEntity.merchantId });

    if (isArchived !== void 0) {
      queryBuilder.andWhere("order.isArchived = :isArchived", { isArchived });
    }

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

    queryBuilder.orderBy("order.createdAt", "DESC");

    return queryBuilder.getManyAndCount();
  }

  public findAndCount(
    where: FindOptionsWhere<OrderEntity>,
    options?: FindManyOptions<OrderEntity>,
  ): Promise<[Array<OrderEntity>, number]> {
    return this.orderEntityRepository.findAndCount({ where, ...options });
  }

  public findOne(
    where: FindOptionsWhere<OrderEntity>,
    options?: FindOneOptions<OrderEntity>,
  ): Promise<OrderEntity | null> {
    return this.orderEntityRepository.findOne({ where, ...options });
  }

  public async create(data: IOrderCreateDto, userEntity: UserEntity): Promise<OrderEntity> {
    const {
      // TODO fix me
      // items,
      userId,
      addressId,
    } = data;

    return this.orderEntityRepository
      .create({
        // items,
        merchant: userEntity.merchant,
        userId,
        addressId,
      })
      .save();
  }

  public async update(where: FindOptionsWhere<OrderEntity>, data: IOrderUpdateDto): Promise<OrderEntity> {
    const orderEntity = await this.orderEntityRepository.findOne({ where });

    if (!orderEntity) {
      throw new NotFoundException("orderNotFound");
    }

    // const price = await this.productService.writeOffAndGetPrice(data.items);

    const items = await Promise.all(
      data.items.map(item =>
        this.orderItemService.create({
          ...item,
          orderId: orderEntity.id,
        }),
      ),
    );

    Object.assign(orderEntity, { ...data, items, price: 100 });
    return orderEntity.save();
  }

  public delete(where: FindOptionsWhere<OrderEntity>): Promise<DeleteResult> {
    return this.orderEntityRepository.delete(where);
  }

  public async move(where: FindOptionsWhere<OrderEntity>, data: IOrderMoveDto): Promise<OrderEntity | undefined> {
    const orderEntity = await this.orderEntityRepository.findOne({ where });

    if (!orderEntity) {
      throw new NotFoundException("orderNotFound");
    }

    Object.assign(orderEntity, data);
    return orderEntity.save();
  }
}
