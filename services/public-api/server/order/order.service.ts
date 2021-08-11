import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {FindConditions, FindManyOptions, Repository, UpdateResult} from "typeorm";

import {OrderStatus} from "@gemunionstudio/framework-types";

import {OrderEntity} from "./order.entity";
import {IOrderCreateDto, IOrderSearchDto} from "./interfaces";
import {UserEntity} from "../user/user.entity";
import {UserService} from "../user/user.service";
import {AuthService} from "../auth/auth.service";
import {ProductService} from "../product/product.service";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderEntityRepository: Repository<OrderEntity>,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly productService: ProductService,
  ) {}

  public findAndCount(
    where: FindConditions<OrderEntity>,
    options?: FindManyOptions<OrderEntity>,
  ): Promise<[Array<OrderEntity>, number]> {
    return this.orderEntityRepository.findAndCount({where, order: {createdAt: "DESC"}, ...options});
  }

  public search(dto: IOrderSearchDto): Promise<[Array<OrderEntity>, number]> {
    const {orderStatus, dateRange} = dto;
    const queryBuilder = this.orderEntityRepository.createQueryBuilder("order").select();

    if (orderStatus && orderStatus.length) {
      if (orderStatus.length === 1) {
        queryBuilder.andWhere("order.orderStatus = :orderStatus", {orderStatus: orderStatus[0]});
      } else {
        queryBuilder.andWhere("order.orderStatus IN(:...orderStatus)", {orderStatus});
      }
    }

    if (dateRange) {
      const [begin, end] = dateRange.split("/");
      queryBuilder.andWhere("order.createdAt BETWEEN :begin AND :end", {begin, end});
    }

    queryBuilder.leftJoinAndSelect("order.merchant", "merchant");
    queryBuilder.leftJoinAndSelect("order.product", "product");
    queryBuilder.orderBy("order.createdAt", "DESC");

    return queryBuilder.getManyAndCount();
  }

  public findOne(where: FindConditions<OrderEntity>): Promise<OrderEntity | undefined> {
    return this.orderEntityRepository.findOne({where});
  }

  public async create(dto: IOrderCreateDto, userEntity: UserEntity): Promise<OrderEntity> {
    const {productId} = dto;

    const productEntity = await this.productService.findOne({id: productId});

    if (!productEntity) {
      throw new NotFoundException("productNotFound");
    }

    return this.orderEntityRepository
      .create({
        orderStatus: OrderStatus.NEW,
        product: productEntity,
        merchantId: productEntity.merchantId,
        user: userEntity,
        price: productEntity.price,
      })
      .save();
  }

  public delete(where: FindConditions<OrderEntity>): Promise<UpdateResult> {
    return this.orderEntityRepository.update(where, {orderStatus: OrderStatus.CANCELED});
  }
}
