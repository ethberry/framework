import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IStakingRuleSearchDto, StakingRuleStatus } from "@framework/types";

import { StakingRuleEntity } from "./staking.entity";
import { IStakingRuleCreateDto, IStakingRuleUpdateDto } from "./interfaces";

@Injectable()
export class StakingService {
  constructor(
    @InjectRepository(StakingRuleEntity)
    private readonly stakingEntityRepository: Repository<StakingRuleEntity>,
  ) {}

  public search(dto: IStakingRuleSearchDto): Promise<[Array<StakingRuleEntity>, number]> {
    const { query, deposit, reward, stakingStatus, skip, take } = dto;

    const queryBuilder = this.stakingEntityRepository.createQueryBuilder("staking");
    queryBuilder.leftJoinAndSelect("staking.deposit", "deposit");
    queryBuilder.leftJoinAndSelect("staking.reward", "reward");

    queryBuilder.select();

    if (query) {
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(staking.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("staking.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    if (stakingStatus) {
      if (stakingStatus.length === 1) {
        queryBuilder.andWhere("staking.stakingStatus = :stakingStatus", { stakingStatus: stakingStatus[0] });
      } else {
        queryBuilder.andWhere("staking.stakingStatus IN(:...stakingStatus)", { stakingStatus });
      }
    }

    if (deposit && deposit.tokenType) {
      if (deposit.tokenType.length === 1) {
        queryBuilder.andWhere("deposit.tokenType = :depositTokenType", { depositTokenType: deposit.tokenType[0] });
      } else {
        queryBuilder.andWhere("deposit.tokenType IN(:...depositTokenType)", { depositTokenType: deposit.tokenType });
      }
    }

    if (reward && reward.tokenType) {
      if (reward.tokenType.length === 1) {
        queryBuilder.andWhere("reward.tokenType = :rewardTokenType", { rewardTokenType: reward.tokenType[0] });
      } else {
        queryBuilder.andWhere("reward.tokenType IN(:...rewardTokenType)", { rewardTokenType: reward.tokenType });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "staking.id": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<StakingRuleEntity>,
    options?: FindOneOptions<StakingRuleEntity>,
  ): Promise<StakingRuleEntity | null> {
    return this.stakingEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IStakingRuleCreateDto): Promise<StakingRuleEntity> {
    return this.stakingEntityRepository.create(dto).save();
  }

  public async update(
    where: FindOptionsWhere<StakingRuleEntity>,
    dto: IStakingRuleUpdateDto,
  ): Promise<StakingRuleEntity> {
    const tokenEntity = await this.findOne(where);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    Object.assign(tokenEntity, dto);

    return tokenEntity.save();
  }

  public async delete(where: FindOptionsWhere<StakingRuleEntity>): Promise<void> {
    const stakingEntity = await this.findOne(where);

    if (!stakingEntity) {
      return;
    }

    if (stakingEntity.stakingStatus === StakingRuleStatus.NEW) {
      await stakingEntity.remove();
    } else {
      Object.assign(stakingEntity, { recipeStatus: StakingRuleStatus.INACTIVE });
      await stakingEntity.save();
    }
  }
}
