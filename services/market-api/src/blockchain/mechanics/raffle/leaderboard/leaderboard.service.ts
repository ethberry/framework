import { Injectable } from "@nestjs/common";

import type { IRaffleLeaderboard, IRaffleLeaderboardSearchDto } from "@framework/types";

import { RaffleTicketService } from "../token/token.service";

@Injectable()
export class RaffleLeaderboardService {
  constructor(private readonly raffleTicketService: RaffleTicketService) {}

  public async leaderboard(dto: IRaffleLeaderboardSearchDto): Promise<[Array<IRaffleLeaderboard>, number]> {
    return this.raffleTicketService.leaderboard(dto);
  }
}
