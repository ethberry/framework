import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";

import { ns } from "@framework/constants";
import type { IStakingChartSearchDto } from "@framework/types";

import { StakingDepositService } from "../deposit/deposit.service";

@Injectable()
export class StakingChartService {
  constructor(
    private readonly stakingDepositService: StakingDepositService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async amountChart(dto: IStakingChartSearchDto): Promise<any> {
    const { emptyReward } = dto;

    return emptyReward ? this.amountChartWithoutReward(dto) : this.amountChartWithReward(dto);
  }

  public async amountChartWithReward(dto: IStakingChartSearchDto): Promise<any> {
    const { deposit, reward, startTimestamp, endTimestamp } = dto;

    // prettier-ignore
    const queryString = `
        SELECT
            COUNT(staking_deposit.id)::INTEGER AS count,
            date_trunc('day', staking_deposit.created_at) as date
        FROM
            ${ns}.staking_deposit
                LEFT JOIN
            ${ns}.staking_rules ON staking_rules.id = staking_deposit.staking_rule_id
                LEFT JOIN
            ${ns}.asset_component as deposit_component ON deposit_component.asset_id = staking_rules.deposit_id
                LEFT JOIN
            ${ns}.contract as deposit_contract ON deposit_component.contract_id = deposit_contract.id
                LEFT JOIN
            ${ns}.asset_component as reward_component ON reward_component.asset_id = staking_rules.reward_id
                LEFT JOIN
            ${ns}.contract as reward_contract ON reward_component.contract_id = reward_contract.id
        WHERE
            deposit_contract.contract_type = $1
          AND
            deposit_contract.id = $2
          AND
            reward_contract.contract_type = $3
          AND
            reward_contract.id = $4
          AND
            (staking_deposit.created_at >= $5 AND staking_deposit.created_at < $6)
        GROUP BY
            date
        ORDER BY
            date
    `;

    return Promise.all([
      this.entityManager.query(queryString, [
        deposit.tokenType,
        deposit.contractId,
        reward.tokenType,
        reward.contractId,
        startTimestamp,
        endTimestamp,
      ]),
      0,
    ]);
  }

  public async amountChartWithoutReward(dto: IStakingChartSearchDto): Promise<any> {
    const { deposit, startTimestamp, endTimestamp } = dto;

    // prettier-ignore
    const queryString = `
        SELECT
            COUNT(staking_deposit.id)::INTEGER AS count,
            date_trunc('day', staking_deposit.created_at) as date
        FROM
            ${ns}.staking_deposit
                LEFT JOIN
            ${ns}.staking_rules ON staking_rules.id = staking_deposit.staking_rule_id
                LEFT JOIN
            ${ns}.asset_component as deposit_component ON deposit_component.asset_id = staking_rules.deposit_id
                LEFT JOIN
            ${ns}.contract as deposit_contract ON deposit_component.contract_id = deposit_contract.id
        WHERE
            deposit_contract.contract_type = $1
          AND
            deposit_contract.id = $2
          AND
            staking_rules.reward_id IS NULL
          AND
            (staking_deposit.created_at >= $3 AND staking_deposit.created_at < $4)
        GROUP BY
            date
        ORDER BY
            date
    `;

    // prettier-ignore
    return Promise.all([
      this.entityManager.query(queryString, [
        deposit.tokenType,
        deposit.contractId,
        startTimestamp,
        endTimestamp,
      ]),
      0,
    ]);
  }

  public async volumeChart(dto: IStakingChartSearchDto): Promise<any> {
    const { deposit, reward, startTimestamp, endTimestamp } = dto;

    // prettier-ignore
    const queryString = `
      WITH cte AS (SELECT start_date::timestamptz,
                          COUNT(staking_deposit.id)     AS transaction_count,
                          SUM(deposit_component.amount) AS amount
                   FROM ${ns}.staking_deposit
                            LEFT JOIN
                        ${ns}.staking_rules ON staking_rules.id = staking_deposit.staking_rule_id
                            LEFT JOIN
                        ${ns}.asset_component as deposit_component ON deposit_component.asset_id = staking_rules.deposit_id
                            CROSS JOIN 
                        generate_series(staking_deposit.start_timestamp, (staking_deposit.start_timestamp + (staking_rules.duration_amount || 'second')::INTERVAL), '1 day') AS series (start_date)
                            LEFT JOIN
                        ${ns}.asset_component as reward_component ON reward_component.asset_id = staking_rules.reward_id
                            LEFT JOIN
                        ${ns}.contract as deposit_contract ON deposit_component.contract_id = deposit_contract.id
                            LEFT JOIN
                        ${ns}.contract as reward_contract ON reward_component.contract_id = reward_contract.id
                   WHERE staking_deposit.start_timestamp <= $6
                     AND (staking_deposit.start_timestamp + (staking_rules.duration_amount || 'second')::INTERVAL) >= $5
                     AND deposit_contract.contract_type = $1
                     AND deposit_contract.id = $2
                     AND reward_contract.contract_type = $3
                     AND reward_contract.id = $4
      
                   GROUP BY start_date
                   ORDER BY start_date)
      SELECT start_date,
             transaction_count,
             amount
      FROM cte
      WHERE start_date BETWEEN $5 AND $6;
    `;

    return Promise.all([
      this.entityManager.query(queryString, [
        deposit.tokenType,
        deposit.contractId,
        reward.tokenType,
        reward.contractId,
        startTimestamp,
        endTimestamp,
      ]),
      0,
    ]);
  }
}
