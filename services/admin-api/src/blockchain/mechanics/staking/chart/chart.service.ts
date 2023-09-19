import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";

import { ns } from "@framework/constants";
import type { IStakingChartSearchDto } from "@framework/types";
import { ModuleType } from "@framework/types";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { StakingContractService } from "../contract/contract.service";

@Injectable()
export class StakingChartService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    protected readonly stakingContractService: StakingContractService,
  ) {}

  public async chart(dto: IStakingChartSearchDto, userEntity: UserEntity): Promise<any> {
    const { contractId, deposit, reward, emptyReward, startTimestamp, endTimestamp } = dto;

    const contractEntity = await this.stakingContractService.findOne({
      id: contractId,
    });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    if (contractEntity.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    if (contractEntity.contractModule !== ModuleType.STAKING) {
      throw new BadRequestException("contractWrongModule");
    }

    // prettier-ignore
    const queryString = `
      WITH cte AS (SELECT
                          start_date::DATE,
                          staking_deposit.id as staking_deposit_id,
                          deposit_component.amount as deposit_component_amount,
                          CASE
                            WHEN start_date::DATE = staking_deposit.start_timestamp::DATE THEN deposit_component.id
                            ELSE NULL
                          END AS new_deposit_id,
                          CASE
                            WHEN start_date::DATE = staking_deposit.start_timestamp::DATE THEN deposit_component.amount
                            ELSE NULL
                          END AS new_deposit_amount
                   FROM ${ns}.staking_deposit
                            INNER JOIN
                        ${ns}.staking_rules ON staking_rules.id = staking_deposit.staking_rule_id
                            INNER JOIN
                        ${ns}.asset_component as deposit_component ON deposit_component.asset_id = staking_rules.deposit_id
                            INNER JOIN
                        ${ns}.contract as deposit_contract ON deposit_component.contract_id = deposit_contract.id
                                                              AND deposit_contract.chain_id = $2
                                                              AND deposit_contract.contract_type = $5
                                                              AND deposit_contract.id = $6
                        ${emptyReward ? "" : `
                            INNER JOIN
                        ${ns}.asset_component as reward_component ON reward_component.asset_id = staking_rules.reward_id
                            INNER JOIN
                        ${ns}.contract as reward_contract ON reward_component.contract_id = reward_contract.id
                                                              AND reward_contract.chain_id = $2
                                                              AND reward_contract.contract_type = $7
                                                              AND reward_contract.id = $8
                        `}
                            CROSS JOIN generate_series(staking_deposit.start_timestamp, (staking_deposit.start_timestamp +  (staking_rules.duration_amount || 'second')::INTERVAL), '1 day') AS series (start_date)
                   WHERE staking_rules.contract_id = $1
                     AND staking_deposit.start_timestamp <= $4
                     AND (staking_deposit.start_timestamp + (staking_rules.duration_amount || 'second')::INTERVAL) >= $3
                   )
      SELECT start_date::timestamptz,
             COUNT(staking_deposit_id) as current_deposit_count,
             SUM(deposit_component_amount) as current_deposit_amount,
             COUNT(new_deposit_id) as new_deposit_count,
             SUM(new_deposit_amount) as new_deposit_amount
      FROM cte
      WHERE start_date BETWEEN $3 AND $4
      GROUP BY start_date
      ORDER BY start_date;
    `;

    return Promise.all([
      this.entityManager.query(
        queryString,
        emptyReward
          ? [contractEntity.id, userEntity.chainId, startTimestamp, endTimestamp, deposit.tokenType, deposit.contractId]
          : [
              contractEntity.id,
              userEntity.chainId,
              startTimestamp,
              endTimestamp,
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
