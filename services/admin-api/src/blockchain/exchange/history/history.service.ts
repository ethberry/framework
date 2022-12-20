import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ExchangeHistoryEntity } from "./history.entity";
import { ExchangeType } from "@framework/types";

@Injectable()
export class ExchangeHistoryService {
  constructor(
    @InjectRepository(ExchangeHistoryEntity)
    private readonly exchangeHistoryEntity: Repository<ExchangeHistoryEntity>,
  ) {}

  public async search(): Promise<[Array<ExchangeHistoryEntity>, number]> {
    const queryBuilder = this.exchangeHistoryEntity.createQueryBuilder("exchangeHistory");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect(
      "exchangeHistory.itemHistory",
      "itemHistory",
      "itemHistory.exchangeType = :itemType",
      { itemType: ExchangeType.ITEM },
    );
    queryBuilder.leftJoinAndSelect(
      "exchangeHistory.priceHistory",
      "priceHistory",
      "priceHistory.exchangeType = :priceType",
      { priceType: ExchangeType.PRICE },
    );

    return queryBuilder.getManyAndCount();
  }
}
