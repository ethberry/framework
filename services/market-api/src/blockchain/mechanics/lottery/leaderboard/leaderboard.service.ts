import { Injectable } from "@nestjs/common";

import type { ILotteryLeaderboard, ILotteryLeaderboardSearchDto } from "@framework/types";

import { LotteryTokenService } from "../token/token.service";

@Injectable()
export class LotteryLeaderboardService {
  constructor(private readonly lotteryTicketService: LotteryTokenService) {}

  public async leaderboard(dto: ILotteryLeaderboardSearchDto): Promise<[Array<ILotteryLeaderboard>, number]> {
    return this.lotteryTicketService.leaderboard(dto);
  }
}
