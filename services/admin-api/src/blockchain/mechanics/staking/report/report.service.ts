import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { parse } from "json2csv";

import { ns } from "@framework/constants";
import type { IStakingStakesSearchDto } from "@framework/types";
import { TokenType } from "@framework/types";

import { StakingStakesEntity } from "../stakes/stakes.entity";
import { StakingStakesService } from "../stakes/stakes.service";

@Injectable()
export class StakingReportService {
  constructor(
    private readonly stakingStakesService: StakingStakesService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async search(dto: Partial<IStakingStakesSearchDto>): Promise<[Array<StakingStakesEntity>, number]> {
    return this.stakingStakesService.search(dto);
  }

  public async chart(dto: IStakingStakesSearchDto): Promise<any> {
    const {
      deposit = {
        tokenType: TokenType.NATIVE,
        contractIds: [],
      },
      reward = {
        tokenType: TokenType.ERC721,
        contractIds: [],
      },
      startTimestamp,
      endTimestamp,
    } = dto;

    // prettier-ignore
    const queryString = `
        SELECT
            COUNT(staking_stakes.id)::INTEGER AS count,
            date_trunc('day', staking_stakes.created_at) as date
        FROM
            ${ns}.staking_stakes
                LEFT JOIN
            ${ns}.staking_rules ON staking_rules.id = staking_stakes.staking_rule_id
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
            (deposit_contract.contract_type = ANY($1) OR cardinality($1) = 0)
          AND
            (deposit_contract.id = ANY($2) OR cardinality($2) = 0)
          AND
            (reward_contract.contract_type = ANY($3) OR cardinality($3) = 0)
          AND
            (reward_contract.id = ANY($4) OR cardinality($4) = 0)
          AND
            (staking_stakes.created_at >= $5 AND staking_stakes.created_at < $6)
        GROUP BY
            date
        ORDER BY
            date
    `;

    return Promise.all([
      this.entityManager.query(queryString, [
        deposit.tokenType,
        deposit.contractIds,
        reward.tokenType,
        reward.contractIds,
        startTimestamp,
        endTimestamp,
      ]),
      0,
    ]);
  }

  public async export(dto: IStakingStakesSearchDto): Promise<string> {
    const { skip: _skip, take: _take, ...rest } = dto;

    const [list] = await this.search(rest);

    const headers = ["id", "account", "createdAt"];

    return parse(
      list.map(stakingStakeEntity => ({
        id: stakingStakeEntity.id,
        account: stakingStakeEntity.account,
        createdAt: stakingStakeEntity.createdAt,
      })),
      { fields: headers },
    );
  }
}
