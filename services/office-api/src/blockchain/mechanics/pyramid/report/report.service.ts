import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { parse } from "json2csv";
import type { IPyramidReportSearchDto } from "@framework/types";

import { PyramidDepositEntity } from "../deposit/deposit.entity";
import { PyramidDepositService } from "../deposit/deposit.service";

@Injectable()
export class PyramidReportService {
  constructor(
    private readonly pyramidDepositService: PyramidDepositService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async search(dto: IPyramidReportSearchDto): Promise<[Array<PyramidDepositEntity>, number]> {
    const { deposit, reward, ...rest } = dto;
    return this.pyramidDepositService.search({
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

  public async export(dto: IPyramidReportSearchDto): Promise<string> {
    const { skip: _skip, take: _take, ...rest } = dto;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const [list] = await this.search(rest as IPyramidReportSearchDto);

    const headers = ["id", "account", "createdAt"];

    return parse(
      list.map(pyramidDepositEntity => ({
        id: pyramidDepositEntity.id,
        account: pyramidDepositEntity.account,
        createdAt: pyramidDepositEntity.createdAt,
      })),
      { fields: headers },
    );
  }
}
