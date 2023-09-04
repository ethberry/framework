import { Injectable } from "@nestjs/common";
import { parse } from "json2csv";
import type { IPonziReportSearchDto } from "@framework/types";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { PonziDepositEntity } from "../deposit/deposit.entity";
import { PonziDepositService } from "../deposit/deposit.service";

@Injectable()
export class PonziReportService {
  constructor(private readonly ponziDepositService: PonziDepositService) {}

  public async search(
    dto: IPonziReportSearchDto,
    userEntity: UserEntity,
  ): Promise<[Array<PonziDepositEntity>, number]> {
    const { deposit, reward, ...rest } = dto;
    return this.ponziDepositService.search(
      {
        ...rest,
        deposit: {
          tokenType: [deposit.tokenType],
          contractIds: [deposit.contractId],
        },
        reward: {
          tokenType: [reward.tokenType],
          contractIds: [reward.contractId],
        },
      },
      userEntity,
    );
  }

  public async export(dto: IPonziReportSearchDto, userEntity: UserEntity): Promise<string> {
    const { skip: _skip, take: _take, ...rest } = dto;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const [list] = await this.search(rest as IPonziReportSearchDto, userEntity);

    const headers = ["id", "account", "createdAt"];

    return parse(
      list.map(ponziDepositEntity => ({
        id: ponziDepositEntity.id,
        account: ponziDepositEntity.account,
        createdAt: ponziDepositEntity.createdAt,
      })),
      { fields: headers },
    );
  }
}
