import { Injectable } from "@nestjs/common";

import { ILeaderboardSearchDto } from "./interfaces/search";
import { ReferralRewardService } from "../reward/reward.service";
import { ReferralRewardEntity } from "../reward/reward.entity";

@Injectable()
export class ReferralLeaderboardService {
  constructor(private readonly referralRewardService: ReferralRewardService) {}

  public async leaderboard(dto: ILeaderboardSearchDto): Promise<[Array<ReferralRewardEntity>, number]> {
    return this.referralRewardService.leaderboard(dto);
  }
}
