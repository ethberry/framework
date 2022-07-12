import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

import { MarketplaceHistoryEntity } from "./marketplace-history.entity";

@Injectable()
export class MarketplaceHistoryService {
  constructor(
    @InjectRepository(MarketplaceHistoryEntity)
    private readonly erc1155HistoryEntity: Repository<MarketplaceHistoryEntity>,
  ) {}

  public async create(dto: DeepPartial<MarketplaceHistoryEntity>): Promise<MarketplaceHistoryEntity> {
    return this.erc1155HistoryEntity.create(dto).save();
  }
}
