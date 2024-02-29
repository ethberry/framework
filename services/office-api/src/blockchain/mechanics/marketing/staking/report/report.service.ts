import { Injectable } from "@nestjs/common";
import { parse } from "json2csv";

import type { IStakingReportSearchDto } from "@framework/types";

import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { StakingDepositEntity } from "../deposit/deposit.entity";
import { StakingDepositService } from "../deposit/deposit.service";

@Injectable()
export class StakingReportService {
  constructor(private readonly stakingDepositService: StakingDepositService) {}

  public async search(
    dto: Partial<IStakingReportSearchDto>,
    userEntity: UserEntity,
  ): Promise<[Array<StakingDepositEntity>, number]> {
    const { deposit, reward, merchantId, contractId, ...rest } = dto;
    return this.stakingDepositService.search(
      {
        contractIds: [contractId as number],
        deposit: {
          tokenType: [deposit!.tokenType],
          contractIds: [deposit!.contractId as number],
        },
        reward: {
          tokenType: [reward!.tokenType],
          contractIds: [reward!.contractId as number],
        },
        merchantId: merchantId as number,
        ...rest,
      },
      userEntity,
    );
  }

  public async export(dto: IStakingReportSearchDto, userEntity: UserEntity): Promise<string> {
    const { skip: _skip, take: _take, ...rest } = dto;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const [list] = await this.search(rest as IStakingReportSearchDto, userEntity);

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
