import { Injectable } from "@nestjs/common";

import { IStakingLeaderboard } from "@framework/types";

import { ILeaderboardSearchDto } from "./interfaces/search";
import { StakingStakesService } from "../stakes/stakes.service";

@Injectable()
export class StakingLeaderboardService {
  constructor(private readonly stakingStakesService: StakingStakesService) {}

  public async leaderboard(dto: ILeaderboardSearchDto): Promise<[Array<IStakingLeaderboard>, number]> {
    return this.stakingStakesService.leaderboard(dto);
  }
}
