import { Injectable } from "@nestjs/common";

import { ILeaderboardSearchDto } from "./interfaces/search";
import { StakingStakesService } from "../stakes/stakes.service";
import { StakingStakesEntity } from "../stakes/stakes.entity";

@Injectable()
export class StakingLeaderboardService {
  constructor(private readonly stakingStakesService: StakingStakesService) {}

  public async leaderboard(dto: ILeaderboardSearchDto): Promise<[Array<StakingStakesEntity>, number]> {
    return this.stakingStakesService.leaderboard(dto);
  }
}
