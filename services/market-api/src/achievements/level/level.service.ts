import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { AchievementLevelEntity } from "./level.entity";

@Injectable()
export class AchievementLevelService {
  constructor(
    @InjectRepository(AchievementLevelEntity)
    private readonly achievementLevelEntityRepository: Repository<AchievementLevelEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<AchievementLevelEntity>,
    options?: FindOneOptions<AchievementLevelEntity>,
  ): Promise<AchievementLevelEntity | null> {
    return this.achievementLevelEntityRepository.findOne({ where, ...options });
  }
}
