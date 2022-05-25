import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

import { Erc20VestingHistoryEntity } from "./vesting-history.entity";

@Injectable()
export class Erc20VestingHistoryService {
  constructor(
    @InjectRepository(Erc20VestingHistoryEntity)
    private readonly erc20TokenHistoryEntityRepository: Repository<Erc20VestingHistoryEntity>,
  ) {}

  public async create(dto: DeepPartial<Erc20VestingHistoryEntity>): Promise<Erc20VestingHistoryEntity> {
    return this.erc20TokenHistoryEntityRepository.create(dto).save();
  }
}
