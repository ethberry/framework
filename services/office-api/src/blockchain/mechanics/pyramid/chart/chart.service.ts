import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";

import { ns } from "@framework/constants";
import type { IPyramidChartSearchDto } from "@framework/types";

import { UserEntity } from "../../../../infrastructure/user/user.entity";

@Injectable()
export class PyramidChartService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async chart(dto: IPyramidChartSearchDto, userEntity: UserEntity): Promise<any> {
    const { deposit, reward, emptyReward, startTimestamp, endTimestamp } = dto;

    // prettier-ignore
    const queryString = `
      WITH cte AS (SELECT
                          start_date::DATE,
                          pyramid_deposit.id as pyramid_deposit_id,
                          deposit_component.amount as deposit_component_amount,
                          CASE
                            WHEN start_date::DATE = pyramid_deposit.start_timestamp::DATE THEN deposit_component.id
                            ELSE NULL
                          END AS new_deposit_id,
                          CASE
                            WHEN start_date::DATE = pyramid_deposit.start_timestamp::DATE THEN deposit_component.amount
                            ELSE NULL
                          END AS new_deposit_amount
                   FROM ${ns}.pyramid_deposit
                            INNER JOIN
                        ${ns}.pyramid_rules ON pyramid_rules.id = pyramid_deposit.pyramid_rule_id
                            INNER JOIN
                        ${ns}.asset_component as deposit_component ON deposit_component.asset_id = pyramid_rules.deposit_id
                            INNER JOIN
                        ${ns}.contract as deposit_contract ON deposit_component.contract_id = deposit_contract.id
                                                              AND deposit_contract.chain_id = $3
                                                              AND deposit_contract.contract_type = $4
                                                              AND deposit_contract.id = $5
                        ${emptyReward ? "" : `
                            INNER JOIN
                        ${ns}.asset_component as reward_component ON reward_component.asset_id = pyramid_rules.reward_id
                            INNER JOIN
                        ${ns}.contract as reward_contract ON reward_component.contract_id = reward_contract.id
                                                              AND reward_contract.chain_id = $3
                                                              AND reward_contract.contract_type = $6
                                                              AND reward_contract.id = $7
                        `}
                            CROSS JOIN generate_series(pyramid_deposit.start_timestamp, (pyramid_deposit.start_timestamp +  (pyramid_rules.duration_amount || 'second')::INTERVAL), '1 day') AS series (start_date)
                   WHERE pyramid_deposit.start_timestamp <= $2
                     AND (pyramid_deposit.start_timestamp + (pyramid_rules.duration_amount || 'second')::INTERVAL) >= $1
                   )
      SELECT start_date::timestamptz,
             COUNT(pyramid_deposit_id) as current_deposit_count,
             SUM(deposit_component_amount) as current_deposit_amount,
             COUNT(new_deposit_id) as new_deposit_count,
             SUM(new_deposit_amount) as new_deposit_amount
      FROM cte
      WHERE start_date BETWEEN $1 AND $2
      GROUP BY start_date
      ORDER BY start_date;
    `;

    return Promise.all([
      this.entityManager.query(
        queryString,
        emptyReward
          ? [startTimestamp, endTimestamp, userEntity.chainId, deposit.tokenType, deposit.contractId]
          : [
              startTimestamp,
              endTimestamp,
              userEntity.chainId,
              deposit.tokenType,
              deposit.contractId,
              reward!.tokenType,
              reward!.contractId,
            ],
      ),
      0,
    ]);
  }
}
