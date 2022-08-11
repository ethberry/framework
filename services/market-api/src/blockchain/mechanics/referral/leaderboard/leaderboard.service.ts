import { Injectable } from "@nestjs/common";

import { ILeaderboardSearchDto, IReferralLeaderboard } from "./interfaces";
import { ReferralRewardService } from "../reward/reward.service";

@Injectable()
export class ReferralLeaderboardService {
  constructor(private readonly referralRewardService: ReferralRewardService) {}

  public async leaderboard(dto: ILeaderboardSearchDto): Promise<[Array<IReferralLeaderboard>, number]> {
    return this.referralRewardService.leaderboard(dto);
  }
}
