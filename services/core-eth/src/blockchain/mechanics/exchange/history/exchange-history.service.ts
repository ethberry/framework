import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository, FindOptionsWhere, FindOneOptions } from "typeorm";

import { ExchangeHistoryEntity } from "./exchange-history.entity";
import { ExchangeEntity } from "../exchange.entity";

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
