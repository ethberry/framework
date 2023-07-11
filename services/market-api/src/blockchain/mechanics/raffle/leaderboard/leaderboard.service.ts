import { Injectable } from "@nestjs/common";

import type { IRaffleLeaderboard, IRaffleLeaderboardSearchDto } from "@framework/types";

import { RaffleTokenService } from "../token/token.service";

@Injectable()
export class RaffleLeaderboardService {
  constructor(private readonly raffleTicketService: RaffleTokenService) {}

  public async leaderboard(dto: IRaffleLeaderboardSearchDto): Promise<[Array<IRaffleLeaderboard>, number]> {
    return this.raffleTicketService.leaderboard(dto);
  }
}
