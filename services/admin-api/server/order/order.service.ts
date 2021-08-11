import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindConditions, FindManyOptions, Repository } from "typeorm";

import { OrderEntity } from "./order.entity";
import { IOrderCreateDto, IOrderSearchDto, IOrderUpdateDto } from "./interfaces";
import { ProductService } from "../product/product.service";
import { UserEntity } from "../user/user.entity";
import { OrderStatus, UserRole } from "@gemunionstudio/framework-types";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderEntityRepository: Repository<OrderEntity>,
    private readonly productService: ProductService,
  ) {}

  public async search(dto: IOrderSearchDto, userEntity: UserEntity): Promise<[Array<OrderEntity>, number]> {
    const { orderStatus, dateRange, merchantId, skip, take } = dto;
    const queryBuilder = this.orderEntityRepository.createQueryBuilder("order").select();

    queryBuilder.select();

    if (!userEntity.userRoles.includes(UserRole.ADMIN)) {
      queryBuilder.andWhere("order.merchantId = :merchantId", { merchantId: userEntity.merchantId });
    } else if (merchantId) {
      queryBuilder.andWhere("order.merchantId = :merchantId", { merchantId });
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

    queryBuilder.leftJoinAndSelect("order.merchant", "merchant");
    queryBuilder.leftJoinAndSelect("order.product", "product");
    queryBuilder.orderBy("order.createdAt", "DESC");

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public findAndCount(
    where: FindConditions<OrderEntity>,
    options?: FindManyOptions<OrderEntity>,
  ): Promise<[Array<OrderEntity>, number]> {
    return this.orderEntityRepository.findAndCount({ where, ...options });
  }

  public findOne(where: FindConditions<OrderEntity>): Promise<OrderEntity | undefined> {
    return this.orderEntityRepository.findOne({ where });
  }

  public async create(dto: IOrderCreateDto): Promise<OrderEntity> {
    const { productId, userId, merchantId } = dto; // workaround for not working transformations

    const productEntity = await this.productService.findOne({ id: productId });

    if (!productEntity) {
      throw new NotFoundException("productNotFound");
    }

    return this.orderEntityRepository
      .create({
        productId,
        userId,
        merchantId,
        orderStatus: OrderStatus.NEW,
        price: productEntity.price,
      })
      .save();
  }

  public async update(where: FindConditions<OrderEntity>, dto: IOrderUpdateDto): Promise<OrderEntity> {
    const orderEntity = await this.orderEntityRepository.findOne(where);

    if (!orderEntity) {
      throw new NotFoundException("orderNotFound");
    }

    Object.assign(orderEntity, dto);
    return orderEntity.save();
  }

  public delete(where: FindConditions<OrderEntity>): Promise<DeleteResult> {
    return this.orderEntityRepository.delete(where);
  }
}
