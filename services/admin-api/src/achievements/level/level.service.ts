import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IAchievementLevelSearchDto } from "@framework/types";

import { AssetService } from "../../blockchain/exchange/asset/asset.service";
import { UserEntity } from "../../infrastructure/user/user.entity";
import { AchievementRuleService } from "../rule/rule.service";
import { AchievementLevelEntity } from "./level.entity";
import type { IAchievementLevelCreateDto, IAchievementLevelUpdateDto } from "./interfaces";

@Injectable()
export class AchievementLevelService {
  constructor(
    @InjectRepository(AchievementLevelEntity)
    private readonly achievementLevelEntityRepository: Repository<AchievementLevelEntity>,
    protected readonly assetService: AssetService,
    protected readonly achievementRuleService: AchievementRuleService,
  ) {}

  public search(dto: Partial<IAchievementLevelSearchDto>): Promise<[Array<AchievementLevelEntity>, number]> {
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

  public async create(dto: IAchievementLevelCreateDto, userEntity: UserEntity): Promise<AchievementLevelEntity> {
    const { item, parameters, achievementRuleId, ...rest } = dto;

    const achievementRuleEntity = await this.achievementRuleService.findOne(
      {
        id: achievementRuleId,
      },
      { relations: { contract: true } },
    );

    if (!achievementRuleEntity) {
      throw new NotFoundException("achievementRuleNotFound");
    }

    if (achievementRuleEntity.contract.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    const itemEntity = await this.assetService.create();
    await this.assetService.update(itemEntity, item, userEntity);

    return this.achievementLevelEntityRepository
      .create({
        ...rest,
        parameters,
        achievementRuleId,
        item: itemEntity,
      })
      .save();
  }

  public async update(
    where: FindOptionsWhere<AchievementLevelEntity>,
    dto: IAchievementLevelUpdateDto,
    userEntity: UserEntity,
  ): Promise<AchievementLevelEntity> {
    const { item, parameters, ...rest } = dto;

    const achievementLevelEntity = await this.findOne(where, {
      relations: {
        achievementRule: {
          contract: true,
        },
        item: {
          components: true,
        },
      },
    });

    if (!achievementLevelEntity) {
      throw new NotFoundException("achievementLevelNotFound");
    }

    if (achievementLevelEntity.achievementRule.contract.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    if (item) {
      await this.assetService.update(achievementLevelEntity.item, item, userEntity);
    }

    if (parameters) {
      Object.assign(achievementLevelEntity, { parameters });
    }

    Object.assign(achievementLevelEntity, rest);
    return achievementLevelEntity.save();
  }

  public async delete(where: FindOptionsWhere<AchievementLevelEntity>, userEntity: UserEntity): Promise<void> {
    const achievementLevelEntity = await this.findOne(where, {
      relations: {
        achievementRule: {
          contract: true,
        },
      },
    });

    if (!achievementLevelEntity) {
      throw new NotFoundException("achievementLevelNotFound");
    }

    if (achievementLevelEntity.achievementRule.contract.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    await achievementLevelEntity.remove();
  }
}
