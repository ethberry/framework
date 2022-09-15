import { Injectable } from "@nestjs/common";

import type { IStakingLeaderboard, IStakingLeaderboardSearchDto } from "@framework/types";

import { StakingDepositService } from "../deposit/deposit.service";

@Injectable()
export class StakingLeaderboardService {
  constructor(private readonly stakingDepositService: StakingDepositService) {}

  public async leaderboard(dto: IStakingLeaderboardSearchDto): Promise<[Array<IStakingLeaderboard>, number]> {
    return this.stakingDepositService.leaderboard(dto);
  }
}
