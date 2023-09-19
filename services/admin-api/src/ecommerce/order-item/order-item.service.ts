import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindManyOptions, FindOptionsWhere, Repository } from "typeorm";

import { OrderItemEntity } from "./order-item.entity";
import type { IOrderItemCreateDto } from "./interfaces";

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItemEntity)
    private readonly orderItemEntityRepository: Repository<OrderItemEntity>,
  ) {}

  public create(data: IOrderItemCreateDto): Promise<OrderItemEntity> {
    return this.orderItemEntityRepository.create(data).save();
  }

  public delete(where: FindOptionsWhere<OrderItemEntity>): Promise<DeleteResult> {
    return this.orderItemEntityRepository.delete(where);
  }

  public findAll(
    where: FindOptionsWhere<OrderItemEntity>,
    options?: FindManyOptions<OrderItemEntity>,
  ): Promise<Array<OrderItemEntity>> {
    return this.orderItemEntityRepository.find({ where, ...options });
  }

  public count(where: FindOptionsWhere<OrderItemEntity>): Promise<number> {
    return this.orderItemEntityRepository.count({ where });
  }
}
