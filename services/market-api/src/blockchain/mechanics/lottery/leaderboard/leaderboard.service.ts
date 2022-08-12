import { Injectable } from "@nestjs/common";

import { ILotteryLeaderboard } from "@framework/types";

import { LotteryTicketService } from "../ticket/ticket.service";
import { ILeaderboardSearchDto } from "../../staking/leaderboard/interfaces/search";

@Injectable()
export class LotteryLeaderboardService {
  constructor(private readonly lotteryTicketService: LotteryTicketService) {}

  public async leaderboard(dto: ILeaderboardSearchDto): Promise<[Array<ILotteryLeaderboard>, number]> {
    return this.lotteryTicketService.leaderboard(dto);
  }
}
