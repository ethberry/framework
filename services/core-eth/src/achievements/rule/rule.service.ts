import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { AchievementRuleEntity } from "./rule.entity";

@Injectable()
export class AchievementsRuleService {
  constructor(
    @InjectRepository(AchievementRuleEntity)
    private readonly achievementRuleEntityRepository: Repository<AchievementRuleEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<AchievementRuleEntity>,
    options?: FindOneOptions<AchievementRuleEntity>,
  ): Promise<AchievementRuleEntity | null> {
    return this.achievementRuleEntityRepository.findOne({ where, ...options });
  }
}
