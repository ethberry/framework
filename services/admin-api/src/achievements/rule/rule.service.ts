import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { ISearchableDto } from "@gemunion/types-collection";

import { AchievementRuleEntity } from "./rule.entity";

@Injectable()
export class AchievementRuleService {
  constructor(
    @InjectRepository(AchievementRuleEntity)
    private readonly achievementRuleEntityRepository: Repository<AchievementRuleEntity>,
  ) {}

  public search(): Promise<[Array<AchievementRuleEntity>, number]> {
    return this.findAndCount({});
  }

  public async autocomplete(): Promise<Array<AchievementRuleEntity>> {
    return this.achievementRuleEntityRepository.find({
      select: ["id", "title"],
    });
  }

  public findAndCount(
    where: FindOptionsWhere<AchievementRuleEntity>,
    options?: FindManyOptions<AchievementRuleEntity>,
  ): Promise<[Array<AchievementRuleEntity>, number]> {
    return this.achievementRuleEntityRepository.findAndCount({ where, ...options });
  }

  public findOne(
    where: FindOptionsWhere<AchievementRuleEntity>,
    options?: FindOneOptions<AchievementRuleEntity>,
  ): Promise<AchievementRuleEntity | null> {
    return this.achievementRuleEntityRepository.findOne({ where, ...options });
  }

  public async update(
    where: FindOptionsWhere<AchievementRuleEntity>,
    dto: ISearchableDto,
  ): Promise<AchievementRuleEntity | undefined> {
    const achievementRuleEntity = await this.achievementRuleEntityRepository.findOne({ where });

    if (!achievementRuleEntity) {
      throw new NotFoundException("achievementLevelNotFound");
    }

    Object.assign(achievementRuleEntity, dto);

    return achievementRuleEntity.save();
  }
}
