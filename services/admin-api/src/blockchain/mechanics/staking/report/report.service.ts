import { Injectable } from "@nestjs/common";
import { parse } from "json2csv";

import { IStakingStakesSearchDto } from "@framework/types";

import { StakingStakesEntity } from "../stakes/stakes.entity";
import { StakingStakesService } from "../stakes/stakes.service";

@Injectable()
export class StakingReportService {
  constructor(private readonly stakingStakesService: StakingStakesService) {}

  public async search(dto: Partial<IStakingStakesSearchDto>): Promise<[Array<StakingStakesEntity>, number]> {
    return this.stakingStakesService.search(dto);
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
