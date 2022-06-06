import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

import { Erc1155MarketplaceHistoryEntity } from "./marketplace-history.entity";

@Injectable()
export class Erc1155MarketplaceHistoryService {
  constructor(
    @InjectRepository(Erc1155MarketplaceHistoryEntity)
    private readonly erc1155HistoryEntity: Repository<Erc1155MarketplaceHistoryEntity>,
  ) {}

  public async create(dto: DeepPartial<Erc1155MarketplaceHistoryEntity>): Promise<Erc1155MarketplaceHistoryEntity> {
    return this.erc1155HistoryEntity.create(dto).save();
  }
}
