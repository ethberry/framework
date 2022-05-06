import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { IErc721AuctionHistorySearchDto } from "@framework/types";

import { Erc721AuctionHistoryEntity } from "./auction-history.entity";

@Injectable()
export class Erc721AuctionHistoryService {
  constructor(
    @InjectRepository(Erc721AuctionHistoryEntity)
    private readonly erc721AuctionHistoryEntityRepository: Repository<Erc721AuctionHistoryEntity>,
  ) {}

  public async search(dto: IErc721AuctionHistorySearchDto): Promise<[Array<Erc721AuctionHistoryEntity>, number]> {
    const { erc721AuctionId, collection, tokenId, take, skip } = dto;
    const queryBuilder = this.erc721AuctionHistoryEntityRepository.createQueryBuilder("history");

    queryBuilder.select();

    if (erc721AuctionId) {
      queryBuilder.andWhere("history.erc721AuctionId = :erc721AuctionId", { erc721AuctionId });
    } else {
      queryBuilder.andWhere("history.event_data->>'tokenId' = :tokenId", { tokenId });
      queryBuilder.andWhere("history.event_data->>'collection' = :collection", { list: collection });
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }
}
