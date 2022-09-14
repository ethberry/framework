import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { parse } from "json2csv";

import { ns } from "@framework/constants";
import type { IPyramidChartSearchDto, IPyramidReportSearchDto, IPyramidStakeItemSearchDto } from "@framework/types";

import { PyramidStakesEntity } from "../stakes/stakes.entity";
import { PyramidStakesService } from "../stakes/stakes.service";

@Injectable()
export class PyramidReportService {
  constructor(
    private readonly pyramidStakesService: PyramidStakesService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async search(dto: IPyramidReportSearchDto): Promise<[Array<PyramidStakesEntity>, number]> {
    const { deposit, reward, ...rest } = dto;
    return this.pyramidStakesService.search({
      ...rest,
      deposit: {
        tokenType: [deposit.tokenType],
        contractIds: [deposit.contractId],
      } as IPyramidStakeItemSearchDto,
      reward: {
        tokenType: [reward.tokenType],
        contractIds: [reward.contractId],
      } as IPyramidStakeItemSearchDto,
    });
  }

  public async chart(dto: IPyramidChartSearchDto): Promise<any> {
    const { deposit, reward, startTimestamp, endTimestamp } = dto;

    // prettier-ignore
    const queryString = `
        SELECT
            COUNT(pyramid_stakes.id)::INTEGER AS count,
            date_trunc('day', pyramid_stakes.created_at) as date
        FROM
            ${ns}.pyramid_stakes
                LEFT JOIN
            ${ns}.pyramid_rules ON pyramid_rules.id = pyramid_stakes.pyramid_rule_id
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
            (pyramid_stakes.created_at >= $5 AND pyramid_stakes.created_at < $6)
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

  public async export(dto: IPyramidReportSearchDto): Promise<string> {
    const { skip: _skip, take: _take, ...rest } = dto;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const [list] = await this.search(rest as IPyramidReportSearchDto);

    const headers = ["id", "account", "createdAt"];

    return parse(
      list.map(pyramidStakeEntity => ({
        id: pyramidStakeEntity.id,
        account: pyramidStakeEntity.account,
        createdAt: pyramidStakeEntity.createdAt,
      })),
      { fields: headers },
    );
  }
}
