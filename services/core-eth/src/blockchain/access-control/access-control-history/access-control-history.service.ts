import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { AccessControlHistoryEntity } from "./access-control-history.entity";

@Injectable()
export class AccessControlHistoryService {
  constructor(
    @InjectRepository(AccessControlHistoryEntity)
    private readonly accessControlHistoryEntityRepository: Repository<AccessControlHistoryEntity>,
  ) {}

  public async create(dto: DeepPartial<AccessControlHistoryEntity>): Promise<AccessControlHistoryEntity> {
    return this.accessControlHistoryEntityRepository.create(dto).save();
  }

  public findOne(
    where: FindOptionsWhere<AccessControlHistoryEntity>,
    options?: FindOneOptions<AccessControlHistoryEntity>,
  ): Promise<AccessControlHistoryEntity | null> {
    return this.accessControlHistoryEntityRepository.findOne({ where, ...options });
  }
}
