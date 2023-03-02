import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { Brackets, EntityManager, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ns } from "@framework/constants";
import type { IPyramidDepositSearchDto, IPyramidLeaderboard, IPyramidLeaderboardSearchDto } from "@framework/types";
import { PyramidDepositStatus } from "@framework/types";

import { PyramidDepositEntity } from "./deposit.entity";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@Injectable()
export class PyramidDepositService {
  constructor(
    @InjectRepository(PyramidDepositEntity)
    private readonly stakesEntityRepository: Repository<PyramidDepositEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public findOne(
    where: FindOptionsWhere<PyramidDepositEntity>,
    options?: FindOneOptions<PyramidDepositEntity>,
  ): Promise<PyramidDepositEntity | null> {
    return this.stakesEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<PyramidDepositEntity>,
    options?: FindOneOptions<PyramidDepositEntity>,
  ): Promise<Array<PyramidDepositEntity>> {
    return this.stakesEntityRepository.find({ where, ...options });
  }

  public async search(
    dto: Partial<IPyramidDepositSearchDto>,
    userEntity: UserEntity,
  ): Promise<[Array<PyramidDepositEntity>, number]> {
    const { query, pyramidDepositStatus, deposit, reward, skip, take } = dto;

    const queryBuilder = this.stakesEntityRepository.createQueryBuilder("stake");
    queryBuilder.leftJoinAndSelect("stake.pyramidRule", "rule");

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

    if (pyramidDepositStatus) {
      if (pyramidDepositStatus.length === 1) {
        queryBuilder.andWhere("stake.pyramidDepositStatus = :pyramidDepositStatus", {
          pyramidDepositStatus: pyramidDepositStatus[0],
        });
      } else {
        queryBuilder.andWhere("stake.pyramidDepositStatus IN(:...pyramidDepositStatus)", { pyramidDepositStatus });
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

  public async leaderboard(dto: IPyramidLeaderboardSearchDto): Promise<[Array<IPyramidLeaderboard>, number]> {
    const { deposit, reward, skip, take } = dto;

    const queryString = `
        SELECT row_number() OVER (ORDER BY account)::INTEGER id,
               SUM(deposit_component.amount)::NUMERIC AS amount,
               deposit_contract.name as name,
               account
        FROM ${ns}.pyramid_deposit
                 LEFT JOIN
             ${ns}.pyramid_rules ON pyramid_rules.id = pyramid_deposit.pyramid_rule_id
                 LEFT JOIN
             ${ns}.asset as asset_deposit ON pyramid_rules.deposit_id = asset_deposit.id
                 LEFT JOIN
             ${ns}.asset as asset_reward ON pyramid_rules.reward_id = asset_reward.id
                 LEFT JOIN
             ${ns}.asset_component as deposit_component ON deposit_component.asset_id = asset_deposit.id
                 LEFT JOIN
             ${ns}.contract as deposit_contract ON deposit_component.contract_id = deposit_contract.id
                 LEFT JOIN
             ${ns}.asset_component as reward_component ON reward_component.asset_id = asset_reward.id
                 LEFT JOIN
             ${ns}.contract as reward_contract ON reward_component.contract_id = reward_contract.id
        WHERE (pyramid_deposit.pyramid_deposit_status = '${PyramidDepositStatus.ACTIVE}' OR
               pyramid_deposit.pyramid_deposit_status = '${PyramidDepositStatus.COMPLETE}')
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

  public findOneWithRelations(where: FindOptionsWhere<PyramidDepositEntity>): Promise<PyramidDepositEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "stake",
        leftJoinAndSelect: {
          rule: "stake.pyramidRule",
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
}
