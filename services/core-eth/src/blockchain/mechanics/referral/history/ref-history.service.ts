import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ReferralHistoryEntity } from "./ref-history.entity";

@Injectable()
export class ReferralHistoryService {
  constructor(
    @InjectRepository(ReferralHistoryEntity)
    private readonly referralHistoryEntityRepository: Repository<ReferralHistoryEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<ReferralHistoryEntity>,
    options?: FindOneOptions<ReferralHistoryEntity>,
  ): Promise<ReferralHistoryEntity | null> {
    return this.referralHistoryEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: DeepPartial<ReferralHistoryEntity>): Promise<ReferralHistoryEntity> {
    return this.referralHistoryEntityRepository.create(dto).save();
  }
}
