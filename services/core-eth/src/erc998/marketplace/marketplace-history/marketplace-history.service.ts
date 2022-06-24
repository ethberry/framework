import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc998MarketplaceHistoryEntity } from "./marketplace-history.entity";

@Injectable()
export class Erc998MarketplaceHistoryService {
  constructor(
    @InjectRepository(Erc998MarketplaceHistoryEntity)
    private readonly erc998HistoryEntity: Repository<Erc998MarketplaceHistoryEntity>,
  ) {}

  public async create(dto: DeepPartial<Erc998MarketplaceHistoryEntity>): Promise<Erc998MarketplaceHistoryEntity> {
    return this.erc998HistoryEntity.create(dto).save();
  }

  public findOne(
    where: FindOptionsWhere<Erc998MarketplaceHistoryEntity>,
    options?: FindOneOptions<Erc998MarketplaceHistoryEntity>,
  ): Promise<Erc998MarketplaceHistoryEntity | null> {
    return this.erc998HistoryEntity.findOne({ where, ...options });
  }
}
