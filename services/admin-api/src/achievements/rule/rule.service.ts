import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindManyOptions, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";

import { AchievementRuleEntity } from "./rule.entity";
import { UserEntity } from "../../infrastructure/user/user.entity";
import { IAchievementRuleAutocompleteDto, IAchievementRuleSearchDto, IAssetDto } from "@framework/types";
import { IAchievementRuleCreateDto, IAchievementRuleUpdateDto } from "./interfaces";
import { AssetService } from "../../blockchain/exchange/asset/asset.service";

@Injectable()
export class AchievementRuleService {
  constructor(
    @InjectRepository(AchievementRuleEntity)
    private readonly achievementRuleEntityRepository: Repository<AchievementRuleEntity>,
    protected readonly assetService: AssetService,
  ) {}

  public search(
    dto: IAchievementRuleSearchDto,
    _userEntity: UserEntity,
  ): Promise<[Array<AchievementRuleEntity>, number]> {
    const { query, achievementType, achievementStatus, contractIds, eventType, skip, take } = dto;
    const queryBuilder = this.achievementRuleEntityRepository.createQueryBuilder("achievement");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("achievement.contract", "contract");
    queryBuilder.leftJoinAndSelect("achievement.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");

    // TODO use merchants if contract?
    // queryBuilder.andWhere("contract.merchantId = :merchantId", {
    //   merchantId: userEntity.merchantId,
    // });

    if (achievementType) {
      if (achievementType.length === 1) {
        queryBuilder.andWhere("achievement.achievementType = :achievementType", {
          achievementType: achievementType[0],
        });
      } else {
        queryBuilder.andWhere("achievement.achievementType IN(:...achievementType)", { achievementType });
      }
    }

    if (achievementStatus) {
      if (achievementStatus.length === 1) {
        queryBuilder.andWhere("achievement.achievementStatus = :achievementStatus", {
          achievementStatus: achievementStatus[0],
        });
      } else {
        queryBuilder.andWhere("achievement.achievementStatus IN(:...achievementStatus)", { achievementStatus });
      }
    }

    if (achievementStatus) {
      if (achievementStatus.length === 1) {
        queryBuilder.andWhere("achievement.eventType = :eventType", {
          eventType: eventType[0],
        });
      } else {
        queryBuilder.andWhere("achievement.eventType IN(:...eventType)", { eventType });
      }
    }

    if (contractIds) {
      if (contractIds.length === 1) {
        queryBuilder.andWhere("achievement.contractId = :contractId", {
          contractId: contractIds[0],
        });
      } else {
        queryBuilder.andWhere("achievement.contractId IN(:...contractIds)", { contractIds });
      }
    }

    if (query) {
      queryBuilder.leftJoin(
        qb => {
          qb.getQuery = () => `LATERAL json_array_elements(achievement.description->'blocks')`;
          return qb;
        },
        `blocks`,
        `TRUE`,
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("achievement.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "achievement.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(
    dto: IAchievementRuleAutocompleteDto,
    userEntity: UserEntity,
  ): Promise<Array<AchievementRuleEntity>> {
    const { achievementType = [], achievementStatus = [] } = dto;

    const where = {
      contract: {
        chainId: userEntity.chainId,
      },
    };

    if (achievementType.length) {
      Object.assign(where, {
        achievementType: In(achievementType),
      });
    }

    if (achievementStatus.length) {
      Object.assign(where, {
        achievementStatus: In(achievementStatus),
      });
    }

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

  public findOneWithRelations(where: FindOptionsWhere<AchievementRuleEntity>): Promise<AchievementRuleEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "rule",
        leftJoinAndSelect: {
          item: "rule.item",
          item_components: "item.components",
          item_contract: "item_components.contract",
          item_template: "item_components.template",
        },
      },
    });
  }

  public async create(dto: IAchievementRuleCreateDto): Promise<AchievementRuleEntity> {
    const { item, ...rest } = dto;
    // add new item
    const itemEntity = await this.assetService.create({
      components: [],
    });
    await this.assetService.update(itemEntity, item);

    return await this.achievementRuleEntityRepository.create({ ...rest, item: itemEntity }).save();
  }

  // public async update(
  //   where: FindOptionsWhere<AchievementRuleEntity>,
  //   dto: IAchievementRuleUpdateDto,
  // ): Promise<AchievementRuleEntity | undefined> {
  //   const achievementRuleEntity = await this.achievementRuleEntityRepository.findOne({ where });
  //
  //   if (!achievementRuleEntity) {
  //     throw new NotFoundException("achievementLevelNotFound");
  //   }
  //
  //   Object.assign(achievementRuleEntity, dto);
  //
  //   return achievementRuleEntity.save();
  // }

  public async update(
    where: FindOptionsWhere<AchievementRuleEntity>,
    dto: IAchievementRuleUpdateDto,
  ): Promise<AchievementRuleEntity> {
    const { item, ...rest } = dto;
    const achievementRuleEntity = await this.findOne(where, {
      join: {
        alias: "rule",
        leftJoinAndSelect: {
          item: "rule.item",
          components: "item.components",
        },
      },
    });

    if (!achievementRuleEntity) {
      throw new NotFoundException("achievementRuleNotFound");
    }

    Object.assign(achievementRuleEntity, rest);

    if (item && item.components.length) {
      // clean templateId if any == 0
      const itemNew: IAssetDto = {
        components: item.components.map(comp =>
          comp.templateId === 0
            ? {
                ...comp,
                templateId: null,
              }
            : comp,
        ),
      };
      await this.assetService.update(achievementRuleEntity.item, itemNew);
    }

    return achievementRuleEntity.save();
  }
}
