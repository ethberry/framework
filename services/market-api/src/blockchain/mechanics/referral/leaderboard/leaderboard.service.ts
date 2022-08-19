import { Injectable } from "@nestjs/common";

import { IReferralLeaderboard } from "@framework/types";

import { ReferralRewardService } from "../reward/reward.service";
import { ILeaderboardSearchDto } from "../../staking/leaderboard/interfaces/search";

@Injectable()
export class ReferralLeaderboardService {
  constructor(private readonly referralRewardService: ReferralRewardService) {}

  public async leaderboard(dto: ILeaderboardSearchDto): Promise<[Array<IReferralLeaderboard>, number]> {
    return this.referralRewardService.leaderboard(dto);
  }
}
