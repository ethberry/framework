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

  public async chart(dto: IStakingChartSearchDto): Promise<any> {
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
}
