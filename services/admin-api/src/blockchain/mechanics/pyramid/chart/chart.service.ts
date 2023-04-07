import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";

import { ns } from "@framework/constants";
import type { IPyramidChartSearchDto } from "@framework/types";

import { PyramidDepositService } from "../deposit/deposit.service";

@Injectable()
export class PyramidChartService {
  constructor(
    private readonly pyramidDepositService: PyramidDepositService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async amountChart(dto: IPyramidChartSearchDto): Promise<any> {
    const { deposit, reward, startTimestamp, endTimestamp } = dto;

    const depositCondition = `AND deposit_contract.contract_type = $3 AND  deposit_contract.id = $4`;
    const rewardCondition = `AND reward_contract.contract_type = $5  AND  reward_contract.id = $6`;

    // prettier-ignore
    const queryString = `
        SELECT
            COUNT(pyramid_deposit.id)::INTEGER AS count,
            date_trunc('day', pyramid_deposit.created_at) as date
        FROM
            ${ns}.pyramid_deposit
                LEFT JOIN
            ${ns}.pyramid_rules ON pyramid_rules.id = pyramid_deposit.pyramid_rule_id
                LEFT JOIN
            ${ns}.asset_component as deposit_component ON deposit_component.asset_id = pyramid_rules.deposit_id
                LEFT JOIN
            ${ns}.contract as deposit_contract ON deposit_component.contract_id = deposit_contract.id
                LEFT JOIN
            ${ns}.asset_component as reward_component ON reward_component.asset_id = pyramid_rules.reward_id
                LEFT JOIN
            ${ns}.contract as reward_contract ON reward_component.contract_id = reward_contract.id
        WHERE
            (pyramid_deposit.created_at >= $1 AND pyramid_deposit.created_at < $2)
             ${deposit.tokenType ? depositCondition : ""}
             ${reward.tokenType ? rewardCondition : ""}
        GROUP BY
            date
        ORDER BY
            date
    `;

    return Promise.all([
      this.entityManager.query(queryString, [
        startTimestamp,
        endTimestamp,
        deposit.tokenType,
        deposit.contractId,
        reward.tokenType,
        reward.contractId,
      ]),
      0,
    ]);
  }
}
