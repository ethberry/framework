import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { LotteryHistoryEntity } from "./history.entity";

@Injectable()
export class LotteryHistoryService {
  constructor(
    @InjectRepository(LotteryHistoryEntity)
    private readonly lotteryHistoryEntityRepository: Repository<LotteryHistoryEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<LotteryHistoryEntity>,
    options?: FindOneOptions<LotteryHistoryEntity>,
  ): Promise<LotteryHistoryEntity | null> {
    return this.lotteryHistoryEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: DeepPartial<LotteryHistoryEntity>): Promise<LotteryHistoryEntity> {
    return this.lotteryHistoryEntityRepository.create(dto).save();
  }
}
