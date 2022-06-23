import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc998TokenHistoryEntity } from "./token-history.entity";

@Injectable()
export class Erc998TokenHistoryService {
  constructor(
    @InjectRepository(Erc998TokenHistoryEntity)
    private readonly erc998TokenHistoryEntity: Repository<Erc998TokenHistoryEntity>,
  ) {}

  public async create(dto: DeepPartial<Erc998TokenHistoryEntity>): Promise<Erc998TokenHistoryEntity> {
    return this.erc998TokenHistoryEntity.create(dto).save();
  }

  public findOne(
    where: FindOptionsWhere<Erc998TokenHistoryEntity>,
    options?: FindOneOptions<Erc998TokenHistoryEntity>,
  ): Promise<Erc998TokenHistoryEntity | null> {
    return this.erc998TokenHistoryEntity.findOne({ where, ...options });
  }

  public async update(
    where: FindOptionsWhere<Erc998TokenHistoryEntity>,
    dto: DeepPartial<Erc998TokenHistoryEntity>,
  ): Promise<Erc998TokenHistoryEntity> {
    const { ...rest } = dto;

    const historyEntity = await this.findOne(where);

    if (!historyEntity) {
      throw new NotFoundException("historyNotFound");
    }

    Object.assign(historyEntity, rest);

    return historyEntity.save();
  }
}
