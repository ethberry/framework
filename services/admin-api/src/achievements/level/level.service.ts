import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindManyOptions, FindOptionsWhere, Repository } from "typeorm";

import { IAchievementLevelSearchDto } from "@framework/types";

import { AchievementLevelEntity } from "./level.entity";
import { IAchievementLevelCreateDto, IAchievementLevelUpdateDto } from "./interfaces";

@Injectable()
export class AchievementLevelService {
  constructor(
    @InjectRepository(AchievementLevelEntity)
    private readonly achievementLevelEntityRepository: Repository<AchievementLevelEntity>,
  ) {}

  public search(dto: IAchievementLevelSearchDto): Promise<[Array<AchievementLevelEntity>, number]> {
    const { query, achievementRuleIds, skip, take } = dto;

    const queryBuilder = this.achievementLevelEntityRepository.createQueryBuilder("level");

    queryBuilder.select();

    if (query) {
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(level.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("level.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    if (achievementRuleIds) {
      if (achievementRuleIds.length === 1) {
        queryBuilder.andWhere("level.achievementRuleId = :achievementRuleId", {
          achievementRuleId: achievementRuleIds[0],
        });
      } else {
        queryBuilder.andWhere("level.achievementRuleId IN(:...achievementRuleIds)", { achievementRuleIds });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy("level.createdAt", "DESC");

    return queryBuilder.getManyAndCount();
  }

  public findAndCount(
    where: FindOptionsWhere<AchievementLevelEntity>,
    options?: FindManyOptions<AchievementLevelEntity>,
  ): Promise<[Array<AchievementLevelEntity>, number]> {
    return this.achievementLevelEntityRepository.findAndCount({ where, ...options });
  }

  public findOne(where: FindOptionsWhere<AchievementLevelEntity>): Promise<AchievementLevelEntity | null> {
    return this.achievementLevelEntityRepository.findOne({ where });
  }

  public async create(dto: IAchievementLevelCreateDto): Promise<AchievementLevelEntity> {
    return this.achievementLevelEntityRepository.create(dto).save();
  }

  public async update(
    where: FindOptionsWhere<AchievementLevelEntity>,
    dto: IAchievementLevelUpdateDto,
  ): Promise<AchievementLevelEntity | undefined> {
    const achievementLevelEntity = await this.achievementLevelEntityRepository.findOne({ where });

    if (!achievementLevelEntity) {
      throw new NotFoundException("achievementLevelNotFound");
    }

    Object.assign(achievementLevelEntity, dto);

    return achievementLevelEntity.save();
  }

  public async delete(where: FindOptionsWhere<AchievementLevelEntity>): Promise<void> {
    await this.achievementLevelEntityRepository.delete(where);
  }
}
