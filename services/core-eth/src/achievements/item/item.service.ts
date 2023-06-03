import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AchievementItemEntity } from "./item.entity";

@Injectable()
export class AchievementsItemService {
  constructor(
    @InjectRepository(AchievementItemEntity)
    private readonly achievementItemEntityRepository: Repository<AchievementItemEntity>,
  ) {}

  public async create(userId: number, achievementRuleId: number, historyId: number): Promise<AchievementItemEntity> {
    return this.achievementItemEntityRepository
      .create({
        userId,
        achievementRuleId,
        historyId,
      })
      .save();
  }
}
