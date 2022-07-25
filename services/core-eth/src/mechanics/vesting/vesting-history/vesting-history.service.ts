import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

import { VestingHistoryEntity } from "./vesting-history.entity";

@Injectable()
export class VestingHistoryService {
  constructor(
    @InjectRepository(VestingHistoryEntity)
    private readonly TokenHistoryEntityRepository: Repository<VestingHistoryEntity>,
  ) {}

  public async create(dto: DeepPartial<VestingHistoryEntity>): Promise<VestingHistoryEntity> {
    return this.TokenHistoryEntityRepository.create(dto).save();
  }
}
