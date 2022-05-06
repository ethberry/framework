import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

import { Erc721AuctionHistoryEntity } from "./auction-history.entity";

@Injectable()
export class Erc721AuctionHistoryService {
  constructor(
    @InjectRepository(Erc721AuctionHistoryEntity)
    private readonly erc721AuctionHistoryEntityRepository: Repository<Erc721AuctionHistoryEntity>,
  ) {}

  public async create(dto: DeepPartial<Erc721AuctionHistoryEntity>): Promise<Erc721AuctionHistoryEntity> {
    return this.erc721AuctionHistoryEntityRepository.create(dto).save();
  }
}
