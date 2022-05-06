import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc721AuctionEntity } from "./auction.entity";

@Injectable()
export class Erc721AuctionService {
  constructor(
    @InjectRepository(Erc721AuctionEntity)
    private readonly auctionEntityRepository: Repository<Erc721AuctionEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<Erc721AuctionEntity>,
    options?: FindOneOptions<Erc721AuctionEntity>,
  ): Promise<Erc721AuctionEntity | null> {
    return this.auctionEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: DeepPartial<Erc721AuctionEntity>): Promise<Erc721AuctionEntity> {
    return this.auctionEntityRepository.create(dto).save();
  }

  public async update(
    where: FindOptionsWhere<Erc721AuctionEntity>,
    dto: Partial<Erc721AuctionEntity>,
  ): Promise<Erc721AuctionEntity> {
    const { ...rest } = dto;

    const auctionEntity = await this.auctionEntityRepository.findOne({ where });

    if (!auctionEntity) {
      throw new NotFoundException("auctionNotFound");
    }

    Object.assign(auctionEntity, rest);
    return auctionEntity.save();
  }
}
