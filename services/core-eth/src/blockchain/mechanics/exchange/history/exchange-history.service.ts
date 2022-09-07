import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ExchangeHistoryEntity } from "./exchange-history.entity";

@Injectable()
export class ExchangeHistoryService {
  constructor(
    @InjectRepository(ExchangeHistoryEntity)
    private readonly exchangeHistoryEntity: Repository<ExchangeHistoryEntity>,
  ) {}

  public async create(dto: DeepPartial<ExchangeHistoryEntity>): Promise<ExchangeHistoryEntity> {
    return this.exchangeHistoryEntity.create(dto).save();
  }

  public findOne(
    where: FindOptionsWhere<ExchangeHistoryEntity>,
    options?: FindOneOptions<ExchangeHistoryEntity>,
  ): Promise<ExchangeHistoryEntity | null> {
    return this.exchangeHistoryEntity.findOne({ where, ...options });
  }
}
