import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";

import type { ISearchableDto } from "@gemunion/types-collection";
import type { IStakingRuleSearchDto } from "@framework/types";
import { StakingRewardTokenType, StakingRuleStatus } from "@framework/types";

import { AssetService } from "../../../exchange/asset/asset.service";
import { StakingRulesEntity } from "./rules.entity";
import type { IStakingRuleAutocompleteDto } from "./interfaces";

@Injectable()
export class StakingRulesService {
  constructor(
    @InjectRepository(StakingRulesEntity)
    private readonly stakingRuleEntityRepository: Repository<StakingRulesEntity>,
    protected readonly assetService: AssetService,
  ) {}

  public search(dto: IStakingRuleSearchDto): Promise<[Array<StakingRulesEntity>, number]> {
    const { query, deposit, reward, stakingRuleStatus, contractIds, skip, take } = dto;

    const queryBuilder = this.stakingRuleEntityRepository.createQueryBuilder("rule");
    queryBuilder.leftJoinAndSelect("rule.deposit", "deposit");
    queryBuilder.leftJoinAndSelect("deposit.components", "deposit_components");
    // queryBuilder.leftJoinAndSelect("deposit_components.template", "deposit_template");
    queryBuilder.leftJoinAndSelect("deposit_components.contract", "deposit_contract");

    queryBuilder.leftJoinAndSelect("rule.reward", "reward");
    queryBuilder.leftJoinAndSelect("reward.components", "reward_components");
    // queryBuilder.leftJoinAndSelect("reward_components.template", "reward_template");
    queryBuilder.leftJoinAndSelect("reward_components.contract", "reward_contract");

    queryBuilder.select();

    if (query) {
      queryBuilder.leftJoin(
        qb => {
          qb.getQuery = () => `LATERAL json_array_elements(rule.description->'blocks')`;
          return qb;
        },
        `blocks`,
        `TRUE`,
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("rule.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    if (contractIds) {
      if (contractIds.length === 1) {
        queryBuilder.andWhere("rule.contractId = :contractId", {
          contractId: contractIds[0],
        });
      } else {
        queryBuilder.andWhere("rule.contractId IN(:...contractIds)", { contractIds });
      }
    }

    if (stakingRuleStatus) {
      if (stakingRuleStatus.length === 1) {
        queryBuilder.andWhere("rule.stakingRuleStatus = :stakingRuleStatus", {
          stakingRuleStatus: stakingRuleStatus[0],
        });
      } else {
        queryBuilder.andWhere("rule.stakingRuleStatus IN(:...stakingRuleStatus)", { stakingRuleStatus });
      }
    }

    if (deposit && deposit.tokenType) {
      if (deposit.tokenType.length === 1) {
        queryBuilder.andWhere("deposit_contract.contractType = :depositTokenType", {
          depositTokenType: deposit.tokenType[0],
        });
      } else {
        queryBuilder.andWhere("deposit_contract.contractType IN(:...depositTokenType)", {
          depositTokenType: deposit.tokenType,
        });
      }
    }

    if (reward && reward.tokenType) {
      queryBuilder.andWhere(
        new Brackets(qb => {
          for (let i = 0, l = reward.tokenType.length; i < l; i++) {
            if (reward.tokenType[i] === StakingRewardTokenType.NONE) {
              qb.orWhere("rule.reward IS NULL");
            } else if (reward.tokenType[i] === StakingRewardTokenType.MYSTERY) {
              qb.orWhere("reward_contract.contractModule = :rewardModuleType", {
                rewardModuleType: StakingRewardTokenType.MYSTERY, // all mystery boxes are erc721
              });
            } else {
              qb.orWhere("reward_contract.contractType = :rewardTokenType", {
                rewardTokenType: reward.tokenType[i],
              });
            }
          }
        }),
      );
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "rule.createdAt": "DESC",
      "rule.id": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<StakingRulesEntity>,
    options?: FindOneOptions<StakingRulesEntity>,
  ): Promise<StakingRulesEntity | null> {
    return this.stakingRuleEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<StakingRulesEntity>): Promise<StakingRulesEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "rule",
        leftJoinAndSelect: {
          contract: "rule.contract",
          deposit: "rule.deposit",
          deposit_components: "deposit.components",
          deposit_contract: "deposit_components.contract",
          deposit_template: "deposit_components.template",
          reward: "rule.reward",
          reward_components: "reward.components",
          reward_contract: "reward_components.contract",
          reward_template: "reward_components.template",
        },
      },
    });
  }

  public async autocomplete(dto: Partial<IStakingRuleAutocompleteDto>): Promise<Array<StakingRulesEntity>> {
    const { stakingRuleStatus = [], stakingId } = dto;
    const where = {};

    if (stakingId) {
      Object.assign(where, {
        contractId: stakingId,
      });
    }

    if (stakingRuleStatus.length) {
      Object.assign(where, {
        // https://github.com/typeorm/typeorm/blob/master/docs/find-options.md
        stakingRuleStatus: In(stakingRuleStatus),
      });
    }

    return this.stakingRuleEntityRepository.find({
      where,
      select: {
        id: true,
        title: true,
        externalId: true,
      },
    });
  }

  public async update(where: FindOptionsWhere<StakingRulesEntity>, dto: ISearchableDto): Promise<StakingRulesEntity> {
    const stakingEntity = await this.findOne(where);

    if (!stakingEntity) {
      throw new NotFoundException("stakingRuleNotFound");
    }

    Object.assign(stakingEntity, {
      stakingRuleStatus: StakingRuleStatus.ACTIVE,
      ...dto,
    });

    return stakingEntity.save();
  }
}
