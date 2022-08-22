import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ns } from "@framework/constants";
import { IStakingLeaderboard, IStakingStakesSearchDto, StakeStatus } from "@framework/types";

import { StakingStakesEntity } from "./stakes.entity";
import { UserEntity } from "../../../../user/user.entity";
import { ILeaderboardSearchDto } from "../leaderboard/interfaces/search";

@Injectable()
export class StakingStakesService {
  constructor(
    @InjectRepository(StakingStakesEntity)
    private readonly stakesEntityRepository: Repository<StakingStakesEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
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

  public async search(
    dto: Partial<IStakingStakesSearchDto>,
    userEntity: UserEntity,
  ): Promise<[Array<StakingStakesEntity>, number]> {
    const { stakeStatus, deposit, reward, skip, take } = dto;

    const queryBuilder = this.stakesEntityRepository.createQueryBuilder("stake");
    queryBuilder.leftJoinAndSelect("stake.stakingRule", "rule");

    queryBuilder.leftJoinAndSelect("rule.deposit", "deposit");
    queryBuilder.leftJoinAndSelect("deposit.components", "deposit_components");
    // queryBuilder.leftJoinAndSelect("deposit_components.template", "deposit_template");
    queryBuilder.leftJoinAndSelect("deposit_components.contract", "deposit_contract");

    queryBuilder.leftJoinAndSelect("rule.reward", "reward");
    queryBuilder.leftJoinAndSelect("reward.components", "reward_components");
    // queryBuilder.leftJoinAndSelect("reward_components.template", "reward_template");
    queryBuilder.leftJoinAndSelect("reward_components.contract", "reward_contract");

    queryBuilder.select();

    queryBuilder.andWhere("stake.account = :account", { account: userEntity.wallet });

    if (stakeStatus) {
      if (stakeStatus.length === 1) {
        queryBuilder.andWhere("stake.stakeStatus = :stakeStatus", { stakeStatus: stakeStatus[0] });
      } else {
        queryBuilder.andWhere("stake.stakeStatus IN(:...stakeStatus)", { stakeStatus });
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

    queryBuilder.orderBy("stake.createdAt", "DESC");

    return queryBuilder.getManyAndCount();
  }

  public async leaderboard(dto: Partial<ILeaderboardSearchDto>): Promise<[Array<IStakingLeaderboard>, number]> {
    const { skip, take } = dto;

    const queryString = `
      SELECT
        row_number() OVER (ORDER BY account)::INTEGER id,
        0 AS amount,
        account
      FROM
        ${ns}.staking_stakes as stake
      WHERE
        stake.stake_status = '${StakeStatus.ACTIVE}'
      GROUP BY account
    `;

    return Promise.all([
      this.entityManager.query(`${queryString} ORDER BY amount DESC OFFSET $1 LIMIT $2`, [skip, take]),
      this.entityManager.query(`SELECT COUNT(DISTINCT(id))::INTEGER as count FROM (${queryString}) as l`),
    ]).then(([list, [{ count }]]) => [list, count]);
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
