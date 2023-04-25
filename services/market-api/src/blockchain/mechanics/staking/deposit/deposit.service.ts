import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { Brackets, EntityManager, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ns } from "@framework/constants";
import type { IStakingDepositSearchDto, IStakingLeaderboard, IStakingLeaderboardSearchDto } from "@framework/types";
import { StakingDepositStatus } from "@framework/types";

import { StakingDepositEntity } from "./deposit.entity";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@Injectable()
export class StakingDepositService {
  constructor(
    @InjectRepository(StakingDepositEntity)
    private readonly stakesEntityRepository: Repository<StakingDepositEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public findOne(
    where: FindOptionsWhere<StakingDepositEntity>,
    options?: FindOneOptions<StakingDepositEntity>,
  ): Promise<StakingDepositEntity | null> {
    return this.stakesEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<StakingDepositEntity>,
    options?: FindOneOptions<StakingDepositEntity>,
  ): Promise<Array<StakingDepositEntity>> {
    return this.stakesEntityRepository.find({ where, ...options });
  }

  public async search(
    dto: Partial<IStakingDepositSearchDto>,
    userEntity: UserEntity,
  ): Promise<[Array<StakingDepositEntity>, number]> {
    const { query, stakingDepositStatus, contractIds, deposit, reward, skip, take } = dto;

    const queryBuilder = this.stakesEntityRepository.createQueryBuilder("stake");
    queryBuilder.leftJoinAndSelect("stake.stakingRule", "rule");

    queryBuilder.leftJoinAndSelect("rule.deposit", "deposit");
    queryBuilder.leftJoinAndSelect("deposit.components", "deposit_components");
    // queryBuilder.leftJoinAndSelect("deposit_components.template", "deposit_template");
    queryBuilder.leftJoinAndSelect("deposit_components.contract", "deposit_contract");

    queryBuilder.leftJoinAndSelect("rule.reward", "reward");
    queryBuilder.leftJoinAndSelect("reward.components", "reward_components");
    queryBuilder.leftJoinAndSelect("reward_components.contract", "reward_contract");

    queryBuilder.leftJoinAndSelect("reward_components.template", "reward_template");

    queryBuilder.select();

    queryBuilder.andWhere("stake.account = :account", { account: userEntity.wallet });

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

    if (stakingDepositStatus) {
      if (stakingDepositStatus.length === 1) {
        queryBuilder.andWhere("stake.stakingDepositStatus = :stakingDepositStatus", {
          stakingDepositStatus: stakingDepositStatus[0],
        });
      } else {
        queryBuilder.andWhere("stake.stakingDepositStatus IN(:...stakingDepositStatus)", { stakingDepositStatus });
      }
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

  public async leaderboard(dto: IStakingLeaderboardSearchDto): Promise<[Array<IStakingLeaderboard>, number]> {
    const { deposit, reward, skip, take } = dto;

    const queryString = `
        SELECT row_number() OVER (ORDER BY account)::INTEGER id,
               SUM(deposit_component.amount)::NUMERIC AS amount,
               deposit_contract.name as name,
               account
        FROM ${ns}.staking_deposit
                 LEFT JOIN
             ${ns}.staking_rules ON staking_rules.id = staking_deposit.staking_rule_id
                 LEFT JOIN
             ${ns}.asset as asset_deposit ON staking_rules.deposit_id = asset_deposit.id
                 LEFT JOIN
             ${ns}.asset as asset_reward ON staking_rules.reward_id = asset_reward.id
                 LEFT JOIN
             ${ns}.asset_component as deposit_component ON deposit_component.asset_id = asset_deposit.id
                 LEFT JOIN
             ${ns}.contract as deposit_contract ON deposit_component.contract_id = deposit_contract.id
                 LEFT JOIN
             ${ns}.asset_component as reward_component ON reward_component.asset_id = asset_reward.id
                 LEFT JOIN
             ${ns}.contract as reward_contract ON reward_component.contract_id = reward_contract.id
        WHERE (staking_deposit.staking_deposit_status = '${StakingDepositStatus.ACTIVE}' OR
               staking_deposit.staking_deposit_status = '${StakingDepositStatus.COMPLETE}')
          AND deposit_contract.contract_type = $1
          AND deposit_contract.id = $2
          AND reward_contract.contract_type = $3
          AND reward_contract.id = $4
        GROUP BY deposit_contract.name, account
    `;

    return Promise.all([
      this.entityManager.query(`${queryString} ORDER BY amount DESC OFFSET $5 LIMIT $6`, [
        deposit.tokenType,
        deposit.contractId,
        reward.tokenType,
        reward.contractId,
        skip,
        take,
      ]),
      this.entityManager.query(
        `SELECT COUNT(DISTINCT (id))::INTEGER as count
         FROM (${queryString}) as l`,
        [deposit.tokenType, deposit.contractId, reward.tokenType, reward.contractId],
      ),
    ]).then(([list, [{ count }]]) => [list, count]);
  }

  public findOneWithRelations(where: FindOptionsWhere<StakingDepositEntity>): Promise<StakingDepositEntity | null> {
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
