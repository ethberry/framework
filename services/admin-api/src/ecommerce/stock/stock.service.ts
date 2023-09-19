import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOptionsWhere, Repository } from "typeorm";

import { StockEntity } from "./stock.entity";
import type { IStockCreateDto, IStockUpdateDto } from "./interfaces";

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockEntity)
    private readonly stockEntityRepository: Repository<StockEntity>,
  ) {}

  public findAndCount(
    where: FindOptionsWhere<StockEntity>,
    options?: FindManyOptions<StockEntity>,
  ): Promise<[Array<StockEntity>, number]> {
    return this.stockEntityRepository.findAndCount({
      where,
      relations: ["product_item"],
      ...options,
    });
  }

  public async update(where: FindOptionsWhere<StockEntity>, dto: IStockUpdateDto): Promise<StockEntity | undefined> {
    const promoEntity = await this.stockEntityRepository.findOne({ where });

    if (!promoEntity) {
      throw new NotFoundException("promoNotFound");
    }

    Object.assign(promoEntity, dto);
    return promoEntity.save();
  }

  public create(dto: IStockCreateDto): Promise<StockEntity> {
    return this.stockEntityRepository.create({ ...dto }).save();
  }

  public async delete(where: FindOptionsWhere<StockEntity>): Promise<void> {
    await this.stockEntityRepository.delete(where);
  }
}
