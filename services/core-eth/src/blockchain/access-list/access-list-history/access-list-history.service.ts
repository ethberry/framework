import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { AccessListHistoryEntity } from "./access-list-history.entity";

@Injectable()
export class AccessListHistoryService {
  constructor(
    @InjectRepository(AccessListHistoryEntity)
    private readonly accessListHistoryEntityRepository: Repository<AccessListHistoryEntity>,
  ) {}

  public async create(dto: DeepPartial<AccessListHistoryEntity>): Promise<AccessListHistoryEntity> {
    return this.accessListHistoryEntityRepository.create(dto).save();
  }

  public findOne(
    where: FindOptionsWhere<AccessListHistoryEntity>,
    options?: FindOneOptions<AccessListHistoryEntity>,
  ): Promise<AccessListHistoryEntity | null> {
    return this.accessListHistoryEntityRepository.findOne({ where, ...options });
  }
}
