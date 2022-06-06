import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { SeaportHistoryEntity } from "./seaport-history.entity";

@Injectable()
export class SeaportHistoryService {
  constructor(
    @InjectRepository(SeaportHistoryEntity)
    private readonly contractManagerHistoryEntityRepository: Repository<SeaportHistoryEntity>,
  ) {}

  public async create(dto: DeepPartial<SeaportHistoryEntity>): Promise<SeaportHistoryEntity> {
    return this.contractManagerHistoryEntityRepository.create(dto).save();
  }

  public findOne(
    where: FindOptionsWhere<SeaportHistoryEntity>,
    options?: FindOneOptions<SeaportHistoryEntity>,
  ): Promise<SeaportHistoryEntity | null> {
    return this.contractManagerHistoryEntityRepository.findOne({ where, ...options });
  }
}
