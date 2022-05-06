import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc721MarketplaceHistoryEntity } from "./marketplace-history.entity";

@Injectable()
export class Erc721MarketplaceHistoryService {
  constructor(
    @InjectRepository(Erc721MarketplaceHistoryEntity)
    private readonly erc721HistoryEntity: Repository<Erc721MarketplaceHistoryEntity>,
  ) {}

  public async create(dto: DeepPartial<Erc721MarketplaceHistoryEntity>): Promise<Erc721MarketplaceHistoryEntity> {
    return this.erc721HistoryEntity.create(dto).save();
  }

  public findOne(
    where: FindOptionsWhere<Erc721MarketplaceHistoryEntity>,
    options?: FindOneOptions<Erc721MarketplaceHistoryEntity>,
  ): Promise<Erc721MarketplaceHistoryEntity | null> {
    return this.erc721HistoryEntity.findOne({ where, ...options });
  }
}
