import { Injectable } from "@nestjs/common";

import type { IReferralLeaderboard, IReferralLeaderboardSearchDto } from "@framework/types";

import { ReferralRewardService } from "../reward/reward.service";

@Injectable()
export class ReferralLeaderboardService {
  constructor(private readonly referralRewardService: ReferralRewardService) {}

  public async leaderboard(dto: IReferralLeaderboardSearchDto): Promise<[Array<IReferralLeaderboard>, number]> {
    return this.referralRewardService.leaderboard(dto);
  }
}
