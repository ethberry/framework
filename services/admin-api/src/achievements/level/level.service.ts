import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IAchievementLevelSearchDto } from "@framework/types";

import { AchievementLevelEntity } from "./level.entity";
import { IAchievementLevelCreateDto, IAchievementLevelUpdateDto } from "./interfaces";
import { AssetService } from "../../blockchain/exchange/asset/asset.service";

@Injectable()
export class AchievementLevelService {
  constructor(
    @InjectRepository(AchievementLevelEntity)
    private readonly achievementLevelEntityRepository: Repository<AchievementLevelEntity>,
    protected readonly assetService: AssetService,
  ) {}

  public search(dto: IAchievementLevelSearchDto): Promise<[Array<AchievementLevelEntity>, number]> {
    const { query, achievementRuleIds, skip, take } = dto;

    const queryBuilder = this.achievementLevelEntityRepository.createQueryBuilder("level");

    queryBuilder.select();

    queryBuilder.leftJoin("level.achievementRule", "rule");
    queryBuilder.addSelect(["rule.title", "rule.achievementType"]);

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

    queryBuilder.orderBy({
      "level.achievementRuleId": "ASC",
      "level.amount": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findAndCount(
    where: FindOptionsWhere<AchievementLevelEntity>,
    options?: FindManyOptions<AchievementLevelEntity>,
  ): Promise<[Array<AchievementLevelEntity>, number]> {
    return this.achievementLevelEntityRepository.findAndCount({ where, ...options });
  }

  public findOne(
    where: FindOptionsWhere<AchievementLevelEntity>,
    options?: FindOneOptions<AchievementLevelEntity>,
  ): Promise<AchievementLevelEntity | null> {
    return this.achievementLevelEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<AchievementLevelEntity>): Promise<AchievementLevelEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "level",
        leftJoinAndSelect: {
          rule: "level.achievementRule",
          item: "level.item",
          item_components: "item.components",
          item_contract: "item_components.contract",
        },
      },
    });
  }

  public async create(dto: IAchievementLevelCreateDto): Promise<AchievementLevelEntity> {
    const { item } = dto;

    const assetEntity = await this.assetService.create({
      components: [],
    });
    await this.assetService.update(assetEntity, item);

    return await this.achievementLevelEntityRepository
      .create({
        ...dto,
        item: assetEntity,
      })
      .save();
  }

  public async update(
    where: FindOptionsWhere<AchievementLevelEntity>,
    dto: IAchievementLevelUpdateDto,
  ): Promise<AchievementLevelEntity> {
    const { item, ...rest } = dto;
    const achievementLevelEntity = await this.findOne(where, {
      join: {
        alias: "level",
        leftJoinAndSelect: {
          item: "level.item",
          components: "item.components",
        },
      },
    });

    if (!achievementLevelEntity) {
      throw new NotFoundException("achievementLevelNotFound");
    }

    Object.assign(achievementLevelEntity, rest);

    if (item) {
      await this.assetService.update(achievementLevelEntity.item, item);
    }

    return achievementLevelEntity.save();
  }

  public async delete(where: FindOptionsWhere<AchievementLevelEntity>): Promise<void> {
    await this.achievementLevelEntityRepository.delete(where);
  }
}
