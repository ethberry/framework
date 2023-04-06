import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { parse } from "json2csv";

import type { IStakingReportSearchDto } from "@framework/types";

import { StakingDepositEntity } from "../deposit/deposit.entity";
import { StakingDepositService } from "../deposit/deposit.service";

@Injectable()
export class StakingReportService {
  constructor(
    private readonly stakingDepositService: StakingDepositService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async search(dto: IStakingReportSearchDto): Promise<[Array<StakingDepositEntity>, number]> {
    const { deposit, reward, ...rest } = dto;
    return this.stakingDepositService.search({
      ...rest,
      deposit: {
        tokenType: [deposit.tokenType],
        contractIds: [deposit.contractId],
      },
      reward: {
        tokenType: [reward.tokenType],
        contractIds: [reward.contractId],
      },
    });
  }

  public async export(dto: IStakingReportSearchDto): Promise<string> {
    const { skip: _skip, take: _take, ...rest } = dto;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const [list] = await this.search(rest as IStakingReportSearchDto);

    const headers = ["id", "account", "createdAt"];

    return parse(
      list.map(stakingDepositEntity => ({
        id: stakingDepositEntity.id,
        account: stakingDepositEntity.account,
        createdAt: stakingDepositEntity.createdAt,
      })),
      { fields: headers },
    );
  }
}
