import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

import { ExchangeHistoryEntity } from "./exchange-history.entity";

@Injectable()
export class ExchangeHistoryService {
  constructor(
    @InjectRepository(ExchangeHistoryEntity)
    private readonly erc1155HistoryEntity: Repository<ExchangeHistoryEntity>,
  ) {}

  public async create(dto: DeepPartial<ExchangeHistoryEntity>): Promise<ExchangeHistoryEntity> {
    return this.erc1155HistoryEntity.create(dto).save();
  }
}
