import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository, FindOptionsWhere, FindOneOptions } from "typeorm";

import { AchievementRedemptionEntity } from "./redemption.entity";

@Injectable()
export class AchievementRedemptionService {
  constructor(
    @InjectRepository(AchievementRedemptionEntity)
    private readonly achievementRedemptionEntityRepository: Repository<AchievementRedemptionEntity>,
  ) {}

  public async create(dto: DeepPartial<AchievementRedemptionEntity>): Promise<AchievementRedemptionEntity> {
    return this.achievementRedemptionEntityRepository.create(dto).save();
  }

  public findOne(
    where: FindOptionsWhere<AchievementRedemptionEntity>,
    options?: FindOneOptions<AchievementRedemptionEntity>,
  ): Promise<AchievementRedemptionEntity | null> {
    return this.achievementRedemptionEntityRepository.findOne({ where, ...options });
  }
}
