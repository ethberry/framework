import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { parse } from "json2csv";
import type { IPonziReportSearchDto } from "@framework/types";

import { PonziDepositEntity } from "../deposit/deposit.entity";
import { PonziDepositService } from "../deposit/deposit.service";

@Injectable()
export class PonziReportService {
  constructor(
    private readonly ponziDepositService: PonziDepositService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async search(dto: IPonziReportSearchDto): Promise<[Array<PonziDepositEntity>, number]> {
    const { deposit, reward, ...rest } = dto;
    return this.ponziDepositService.search({
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

  public async export(dto: IPonziReportSearchDto): Promise<string> {
    const { skip: _skip, take: _take, ...rest } = dto;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const [list] = await this.search(rest as IPonziReportSearchDto);

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
