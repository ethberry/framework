import { Injectable } from "@nestjs/common";

import type { ILotteryLeaderboard, ILotteryLeaderboardSearchDto } from "@framework/types";

import { LotteryTicketService } from "../ticket/ticket.service";

@Injectable()
export class LotteryLeaderboardService {
  constructor(private readonly lotteryTicketService: LotteryTicketService) {}

  public async leaderboard(dto: ILotteryLeaderboardSearchDto): Promise<[Array<ILotteryLeaderboard>, number]> {
    return this.lotteryTicketService.leaderboard(dto);
  }
}
