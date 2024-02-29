import { Injectable } from "@nestjs/common";

import type { IPonziLeaderboard, IPonziLeaderboardSearchDto } from "@framework/types";

import { PonziDepositService } from "../deposit/deposit.service";

@Injectable()
export class PonziLeaderboardService {
  constructor(private readonly ponziDepositService: PonziDepositService) {}

  public async leaderboard(dto: IPonziLeaderboardSearchDto): Promise<[Array<IPonziLeaderboard>, number]> {
    return this.ponziDepositService.leaderboard(dto);
  }
}
