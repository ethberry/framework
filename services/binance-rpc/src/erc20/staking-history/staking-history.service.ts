import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

import { Erc20StakingHistoryEntity } from "./staking-history.entity";

@Injectable()
export class Erc20StakingHistoryService {
  constructor(
    @InjectRepository(Erc20StakingHistoryEntity)
    private readonly erc20TokenHistoryEntityRepository: Repository<Erc20StakingHistoryEntity>,
  ) {}

  public async create(dto: DeepPartial<Erc20StakingHistoryEntity>): Promise<Erc20StakingHistoryEntity> {
    return this.erc20TokenHistoryEntityRepository.create(dto).save();
  }
}
