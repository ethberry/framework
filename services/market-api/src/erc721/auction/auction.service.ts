import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { IErc721AuctionSearchDto } from "@framework/types";

import { Erc721AuctionEntity } from "./auction.entity";

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(Erc721AuctionEntity)
    private readonly auctionEntityRepository: Repository<Erc721AuctionEntity>,
  ) {}

  public async search(dto: IErc721AuctionSearchDto): Promise<[Array<Erc721AuctionEntity>, number]> {
    const { skip, take, maxPrice, minPrice, sort, sortBy, owner, auctionStatus } = dto;

    const queryBuilder = this.auctionEntityRepository.createQueryBuilder("auction");

    queryBuilder.select();

    // TODO where finish timestamp less than now

    if (owner) {
      queryBuilder.andWhere("auction.owner = :owner", {
        owner,
      });
    }

    queryBuilder.leftJoinAndSelect("auction.erc721Collection", "collection");
    queryBuilder.leftJoinAndSelect("auction.erc721Token", "token");
    queryBuilder.leftJoinAndSelect("token.erc721Template", "template");

    if (auctionStatus) {
      if (auctionStatus.length === 1) {
        queryBuilder.andWhere("auction.auctionStatus = :auctionStatus", { auctionStatus: auctionStatus[0] });
      } else {
        queryBuilder.andWhere("auction.auctionStatus IN(:...auctionStatus)", { auctionStatus });
      }
    }

    if (maxPrice) {
      queryBuilder.andWhere("auction.startPrice <= :maxPrice", { maxPrice });
    }

    if (minPrice) {
      queryBuilder.andWhere("auction.startPrice >= :minPrice", { minPrice });
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    queryBuilder.orderBy(`auction.${sortBy}`, sort.toUpperCase());

    return queryBuilder.getManyAndCount();
  }
}
