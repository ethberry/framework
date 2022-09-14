import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IStakingRuleSearchDto, StakingStatus } from "@framework/types";

import { StakingRulesEntity } from "./rules.entity";
import { IStakingCreateDto, IStakingUpdateDto } from "./interfaces";
import { AssetService } from "../../asset/asset.service";

@Injectable()
export class StakingRulesService {
  constructor(
    @InjectRepository(StakingRulesEntity)
    private readonly stakingRuleEntityRepository: Repository<StakingRulesEntity>,
    protected readonly assetService: AssetService,
  ) {}

  public search(dto: IStakingRuleSearchDto): Promise<[Array<StakingRulesEntity>, number]> {
    const { query, deposit, reward, stakingStatus, skip, take } = dto;

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

    if (stakingStatus) {
      if (stakingStatus.length === 1) {
        queryBuilder.andWhere("rule.stakingStatus = :stakingStatus", { stakingStatus: stakingStatus[0] });
      } else {
        queryBuilder.andWhere("rule.stakingStatus IN(:...stakingStatus)", { stakingStatus });
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

  public async create(dto: IStakingCreateDto): Promise<StakingRulesEntity> {
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

    return this.stakingRuleEntityRepository.create(dto).save();
  }

  public async update(
    where: FindOptionsWhere<StakingRulesEntity>,
    dto: IStakingUpdateDto,
  ): Promise<StakingRulesEntity> {
    const { reward, deposit, ...rest } = dto;
    const stakingEntity = await this.findOne(where, { relations: { deposit: true, reward: true } });

    if (!stakingEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    Object.assign(stakingEntity.deposit, deposit);
    Object.assign(stakingEntity.reward, reward);

    Object.assign(stakingEntity, rest);

    return stakingEntity.save();
  }

  public async delete(where: FindOptionsWhere<StakingRulesEntity>): Promise<void> {
    const stakingEntity = await this.findOne(where);

    if (!stakingEntity) {
      return;
    }

    if (stakingEntity.stakingStatus === StakingStatus.NEW) {
      await stakingEntity.remove();
    } else {
      Object.assign(stakingEntity, { stakingStatus: StakingStatus.INACTIVE });
      await stakingEntity.save();
    }
  }
}
