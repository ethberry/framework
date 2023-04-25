import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AchievementType } from "@framework/types";

import { AchievementItemEntity } from "./item.entity";
import { UserEntity } from "../../infrastructure/user/user.entity";
import { AchievementsRuleService } from "../rule/rule.service";

@Injectable()
export class AchievementsItemService {
  constructor(
    @InjectRepository(AchievementItemEntity)
    private readonly achievementItemEntityRepository: Repository<AchievementItemEntity>,
    private readonly achievementsRuleService: AchievementsRuleService,
  ) {}

  public async create(userEntity: UserEntity, achievementType: AchievementType): Promise<AchievementItemEntity> {
    const achievementsRuleEntity = await this.achievementsRuleService.findOne({ achievementType });

    if (!achievementsRuleEntity) {
      throw new NotFoundException("achievementsRuleNotFound");
    }

    return this.achievementItemEntityRepository
      .create({
        user: userEntity,
        achievementRule: achievementsRuleEntity,
      })
      .save();
  }
}
