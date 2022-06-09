import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

import { StakingHistoryEntity } from "./staking-history.entity";

@Injectable()
export class StakingHistoryService {
  constructor(
    @InjectRepository(StakingHistoryEntity)
    private readonly stakingHistoryEntityRepository: Repository<StakingHistoryEntity>,
  ) {}

  public async create(dto: DeepPartial<StakingHistoryEntity>): Promise<StakingHistoryEntity> {
    return this.stakingHistoryEntityRepository.create(dto).save();
  }
}
