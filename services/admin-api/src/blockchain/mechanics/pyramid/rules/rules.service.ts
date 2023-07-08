import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";

import type { ISearchableDto } from "@gemunion/types-collection";
import type { IPyramidRuleSearchDto } from "@framework/types";
import { PyramidRuleStatus } from "@framework/types";

import { AssetService } from "../../../exchange/asset/asset.service";
import { PyramidRulesEntity } from "./rules.entity";
import { IPyramidRuleAutocompleteDto } from "./interfaces";

@Injectable()
export class PyramidRulesService {
  constructor(
    @InjectRepository(PyramidRulesEntity)
    private readonly pyramidRuleEntityRepository: Repository<PyramidRulesEntity>,
    protected readonly assetService: AssetService,
  ) {}

  public search(dto: IPyramidRuleSearchDto): Promise<[Array<PyramidRulesEntity>, number]> {
    const { query, deposit, reward, pyramidRuleStatus, skip, take } = dto;

    const queryBuilder = this.pyramidRuleEntityRepository.createQueryBuilder("rule");
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

    if (pyramidRuleStatus) {
      if (pyramidRuleStatus.length === 1) {
        queryBuilder.andWhere("rule.pyramidRuleStatus = :pyramidRuleStatus", {
          pyramidRuleStatus: pyramidRuleStatus[0],
        });
      } else {
        queryBuilder.andWhere("rule.pyramidRuleStatus IN(:...pyramidRuleStatus)", { pyramidRuleStatus });
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
    where: FindOptionsWhere<PyramidRulesEntity>,
    options?: FindOneOptions<PyramidRulesEntity>,
  ): Promise<PyramidRulesEntity | null> {
    return this.pyramidRuleEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<PyramidRulesEntity>): Promise<PyramidRulesEntity | null> {
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

  public async autocomplete(dto: Partial<IPyramidRuleAutocompleteDto>): Promise<Array<PyramidRulesEntity>> {
    const { pyramidRuleStatus = [], pyramidId } = dto;
    const where = {};

    if (pyramidId) {
      Object.assign(where, {
        contractId: pyramidId,
      });
    }

    if (pyramidRuleStatus.length) {
      Object.assign(where, {
        // https://github.com/typeorm/typeorm/blob/master/docs/find-options.md
        pyramidRuleStatus: In(pyramidRuleStatus),
      });
    }

    return this.pyramidRuleEntityRepository.find({
      where,
      select: {
        id: true,
        title: true,
        externalId: true,
      },
    });
  }

  public async update(where: FindOptionsWhere<PyramidRulesEntity>, dto: ISearchableDto): Promise<PyramidRulesEntity> {
    const pyramidEntity = await this.findOne(where);

    if (!pyramidEntity) {
      throw new NotFoundException("pyramidRuleNotFound");
    }

    Object.assign(pyramidEntity, {
      pyramidRuleStatus: PyramidRuleStatus.ACTIVE,
      ...dto,
    });

    return pyramidEntity.save();
  }
}
