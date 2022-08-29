import { Injectable } from "@nestjs/common";

import type { IStakingLeaderboard, IStakingLeaderboardSearchDto } from "@framework/types";

import { StakingStakesService } from "../stakes/stakes.service";

@Injectable()
export class StakingLeaderboardService {
  constructor(private readonly stakingStakesService: StakingStakesService) {}

  public async leaderboard(dto: IStakingLeaderboardSearchDto): Promise<[Array<IStakingLeaderboard>, number]> {
    return this.stakingStakesService.leaderboard(dto);
  }
}
