import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";

import type { ISearchableDto } from "@gemunion/types-collection";
import type { IPonziRuleSearchDto } from "@framework/types";
import { PonziRuleStatus } from "@framework/types";

import { PonziRulesEntity } from "./rules.entity";
import type { IPonziRuleAutocompleteDto } from "./interfaces";

@Injectable()
export class PonziRulesService {
  constructor(
    @InjectRepository(PonziRulesEntity)
    private readonly ponziRuleEntityRepository: Repository<PonziRulesEntity>,
  ) {}

  public search(dto: Partial<IPonziRuleSearchDto>): Promise<[Array<PonziRulesEntity>, number]> {
    const { query, deposit, reward, ponziRuleStatus, skip, take } = dto;

    const queryBuilder = this.ponziRuleEntityRepository.createQueryBuilder("rule");
    queryBuilder.leftJoinAndSelect("rule.contract", "contract");
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

    if (ponziRuleStatus) {
      if (ponziRuleStatus.length === 1) {
        queryBuilder.andWhere("rule.ponziRuleStatus = :ponziRuleStatus", {
          ponziRuleStatus: ponziRuleStatus[0],
        });
      } else {
        queryBuilder.andWhere("rule.ponziRuleStatus IN(:...ponziRuleStatus)", { ponziRuleStatus });
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
      if (reward.tokenType.length === 1) {
        queryBuilder.andWhere("reward_contract.contractType = :rewardTokenType", {
          rewardTokenType: reward.tokenType[0],
        });
      } else {
        queryBuilder.andWhere("reward_contract.contractType IN(:...rewardTokenType)", {
          rewardTokenType: reward.tokenType,
        });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "rule.id": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<PonziRulesEntity>,
    options?: FindOneOptions<PonziRulesEntity>,
  ): Promise<PonziRulesEntity | null> {
    return this.ponziRuleEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<PonziRulesEntity>): Promise<PonziRulesEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "rule",
        leftJoinAndSelect: {
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

  public async autocomplete(dto: Partial<IPonziRuleAutocompleteDto>): Promise<Array<PonziRulesEntity>> {
    const { ponziRuleStatus = [], ponziId } = dto;
    const where = {};

    if (ponziId) {
      Object.assign(where, {
        contractId: ponziId,
      });
    }

    if (ponziRuleStatus.length) {
      Object.assign(where, {
        // https://github.com/typeorm/typeorm/blob/master/docs/find-options.md
        ponziRuleStatus: In(ponziRuleStatus),
      });
    }

    return this.ponziRuleEntityRepository.find({
      where,
      select: {
        id: true,
        title: true,
        externalId: true,
      },
    });
  }

  public async update(where: FindOptionsWhere<PonziRulesEntity>, dto: ISearchableDto): Promise<PonziRulesEntity> {
    const ponziEntity = await this.findOne(where);

    if (!ponziEntity) {
      throw new NotFoundException("ponziRuleNotFound");
    }

    Object.assign(ponziEntity, {
      ponziRuleStatus: PonziRuleStatus.ACTIVE,
      ...dto,
    });

    return ponziEntity.save();
  }
}
