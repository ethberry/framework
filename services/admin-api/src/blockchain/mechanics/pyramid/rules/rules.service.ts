import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IPyramidRuleSearchDto, PyramidRuleStatus } from "@framework/types";

import { PyramidRulesEntity } from "./rules.entity";
import { IPyramidCreateDto, IPyramidUpdateDto } from "./interfaces";
import { AssetService } from "../../asset/asset.service";

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
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(rule.description->'blocks') blocks ON TRUE",
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

  public async create(dto: IPyramidCreateDto): Promise<PyramidRulesEntity> {
    const { deposit, reward } = dto;

    const depositEntity = await this.assetService.create({
      components: [],
    });
    await this.assetService.update(depositEntity, deposit);

    const rewardEntity = await this.assetService.create({
      components: [],
    });
    await this.assetService.update(rewardEntity, reward);

    Object.assign(dto, { deposit: depositEntity, reward: rewardEntity });

    return this.pyramidRuleEntityRepository.create(dto).save();
  }

  public async update(
    where: FindOptionsWhere<PyramidRulesEntity>,
    dto: IPyramidUpdateDto,
  ): Promise<PyramidRulesEntity> {
    const { reward, deposit, ...rest } = dto;
    const pyramidEntity = await this.findOne(where, { relations: { deposit: true, reward: true } });

    if (!pyramidEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    Object.assign(pyramidEntity.deposit, deposit);
    Object.assign(pyramidEntity.reward, reward);

    Object.assign(pyramidEntity, rest);

    return pyramidEntity.save();
  }

  public async delete(where: FindOptionsWhere<PyramidRulesEntity>): Promise<void> {
    const pyramidEntity = await this.findOne(where);

    if (!pyramidEntity) {
      return;
    }

    if (pyramidEntity.pyramidRuleStatus === PyramidRuleStatus.NEW) {
      await pyramidEntity.remove();
    } else {
      Object.assign(pyramidEntity, { pyramidRuleStatus: PyramidRuleStatus.INACTIVE });
      await pyramidEntity.save();
    }
  }
}
