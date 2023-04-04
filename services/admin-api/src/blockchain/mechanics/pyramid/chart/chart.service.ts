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

  public async chart(dto: IPyramidChartSearchDto): Promise<any> {
    const { emptyReward } = dto;
    return emptyReward ? this.chartWithoutReward(dto) : this.chartWithReward(dto);
  }

  public async chartWithReward(dto: IPyramidChartSearchDto): Promise<any> {
    const { deposit, reward, startTimestamp, endTimestamp } = dto;

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
        WHERE
            deposit_contract.contract_type = $1
          AND
            deposit_contract.id = $2
          AND
            reward_contract.contract_type = $3
          AND
            reward_contract.id = $4
          AND
            (pyramid_deposit.created_at >= $5 AND pyramid_deposit.created_at < $6)
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

  public async chartWithoutReward(dto: IPyramidChartSearchDto): Promise<any> {
    const { deposit, startTimestamp, endTimestamp } = dto;

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
            ${ns}.asset as asset_deposit ON pyramid_rules.deposit_id = asset_deposit.id
                LEFT JOIN
            ${ns}.asset_component as deposit_component ON deposit_component.asset_id = asset_deposit.id
                LEFT JOIN
            ${ns}.contract as deposit_contract ON deposit_component.contract_id = deposit_contract.id
        WHERE
            deposit_contract.contract_type = $1
          AND
            deposit_contract.id = $2
          AND
            pyramid_rules.reward_id IS NULL
          AND
            (pyramid_deposit.created_at >= $3 AND pyramid_deposit.created_at < $4)
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
}
