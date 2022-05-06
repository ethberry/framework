import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc721TokenHistoryEntity } from "./token-history.entity";

@Injectable()
export class Erc721TokenHistoryService {
  constructor(
    @InjectRepository(Erc721TokenHistoryEntity)
    private readonly erc721TokenHistoryEntity: Repository<Erc721TokenHistoryEntity>,
  ) {}

  public async create(dto: DeepPartial<Erc721TokenHistoryEntity>): Promise<Erc721TokenHistoryEntity> {
    return this.erc721TokenHistoryEntity.create(dto).save();
  }

  public findOne(
    where: FindOptionsWhere<Erc721TokenHistoryEntity>,
    options?: FindOneOptions<Erc721TokenHistoryEntity>,
  ): Promise<Erc721TokenHistoryEntity | null> {
    return this.erc721TokenHistoryEntity.findOne({ where, ...options });
  }

  public async update(
    where: FindOptionsWhere<Erc721TokenHistoryEntity>,
    dto: DeepPartial<Erc721TokenHistoryEntity>,
  ): Promise<Erc721TokenHistoryEntity> {
    const { ...rest } = dto;

    const historyEntity = await this.findOne(where);

    if (!historyEntity) {
      throw new NotFoundException("historyNotFound");
    }

    Object.assign(historyEntity, rest);

    return historyEntity.save();
  }
}
