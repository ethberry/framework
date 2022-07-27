import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IStakingStakesSearchDto } from "@framework/types";

import { StakingStakesEntity } from "./stakes.entity";

@Injectable()
export class StakingStakesService {
  constructor(
    @InjectRepository(StakingStakesEntity)
    private readonly stakesEntityRepository: Repository<StakingStakesEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<StakingStakesEntity>,
    options?: FindOneOptions<StakingStakesEntity>,
  ): Promise<StakingStakesEntity | null> {
    return this.stakesEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<StakingStakesEntity>,
    options?: FindOneOptions<StakingStakesEntity>,
  ): Promise<Array<StakingStakesEntity>> {
    return this.stakesEntityRepository.find({ where, ...options });
  }

  public async search(dto: IStakingStakesSearchDto): Promise<[Array<StakingStakesEntity>, number]> {
    const { stakeStatus, skip, take } = dto;

    const queryBuilder = this.stakesEntityRepository.createQueryBuilder("stake");
    queryBuilder.leftJoinAndSelect("stake.stakingRule", "rule");

    queryBuilder.select();

    if (stakeStatus) {
      if (stakeStatus.length === 1) {
        queryBuilder.andWhere("stake.stakeStatus = :stakeStatus", { stakeStatus: stakeStatus[0] });
      } else {
        queryBuilder.andWhere("stake.stakeStatus IN(:...stakeStatus)", { stakeStatus });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy("stake.createdAt", "DESC");

    return queryBuilder.getManyAndCount();
  }

  public findOneWithRelations(where: FindOptionsWhere<StakingStakesEntity>): Promise<StakingStakesEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "stake",
        leftJoinAndSelect: {
          rule: "stake.stakingRule",
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
}
