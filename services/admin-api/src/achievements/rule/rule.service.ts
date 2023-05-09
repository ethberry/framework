import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindManyOptions, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";

import { AchievementRuleEntity } from "./rule.entity";
import { UserEntity } from "../../infrastructure/user/user.entity";
import { IAchievementRuleAutocompleteDto, IAchievementRuleSearchDto } from "@framework/types";
import { IAchievementRuleCreateDto, IAchievementRuleUpdateDto } from "./interfaces";
import { IMysteryboxCreateDto } from "../../blockchain/mechanics/mystery/box/interfaces";
import { MysteryBoxEntity } from "../../blockchain/mechanics/mystery/box/box.entity";
import { AchievementRuleCreateDto } from "./dto";
import { ContractEntity } from "../../blockchain/hierarchy/contract/contract.entity";

@Injectable()
export class AchievementRuleService {
  constructor(
    @InjectRepository(AchievementRuleEntity)
    private readonly achievementRuleEntityRepository: Repository<AchievementRuleEntity>,
  ) {}

  public search(
    dto: IAchievementRuleSearchDto,
    userEntity: UserEntity,
  ): Promise<[Array<AchievementRuleEntity>, number]> {
    const { query, achievementType, achievementStatus, contractIds, eventType, skip, take } = dto;
    const queryBuilder = this.achievementRuleEntityRepository.createQueryBuilder("achievement");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("achievement.contract", "contract");

    queryBuilder.andWhere("contract.merchantId = :merchantId", {
      merchantId: userEntity.merchantId,
    });

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

  public async create(dto: IAchievementRuleCreateDto): Promise<AchievementRuleEntity> {
    // const { title, description, contractId, achievementStatus, achievementType, eventType } = dto;
    return await this.achievementRuleEntityRepository.create(dto).save();
  }

  public async update(
    where: FindOptionsWhere<AchievementRuleEntity>,
    dto: IAchievementRuleUpdateDto,
  ): Promise<AchievementRuleEntity | undefined> {
    const achievementRuleEntity = await this.achievementRuleEntityRepository.findOne({ where });

    if (!achievementRuleEntity) {
      throw new NotFoundException("achievementLevelNotFound");
    }

    Object.assign(achievementRuleEntity, dto);

    return achievementRuleEntity.save();
  }
}
