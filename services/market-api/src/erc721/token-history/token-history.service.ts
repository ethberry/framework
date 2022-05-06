import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IErc721TokenHistorySearchDto } from "@framework/types";

import { Erc721TokenHistoryEntity } from "./token-history.entity";

@Injectable()
export class Erc721TokenHistoryService {
  constructor(
    @InjectRepository(Erc721TokenHistoryEntity)
    private readonly erc721TokenHistoryEntityRepository: Repository<Erc721TokenHistoryEntity>,
  ) {}

  public async search(dto: IErc721TokenHistorySearchDto): Promise<[Array<Erc721TokenHistoryEntity>, number]> {
    const { erc721TokenId, collection, tokenId, take, skip } = dto;
    const queryBuilder = this.erc721TokenHistoryEntityRepository.createQueryBuilder("history");

    queryBuilder.select();

    if (erc721TokenId) {
      queryBuilder.andWhere("history.erc721TokenId = :erc721TokenId", { erc721TokenId });
    } else {
      queryBuilder.andWhere("history.address = :address", { address: collection });
      queryBuilder.andWhere("history.event_data->>'tokenId' = :tokenId", { tokenId });
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<Erc721TokenHistoryEntity>,
    options?: FindOneOptions<Erc721TokenHistoryEntity>,
  ): Promise<Erc721TokenHistoryEntity | null> {
    return this.erc721TokenHistoryEntityRepository.findOne({ where, ...options });
  }
}
