import { Injectable } from "@nestjs/common";

import type { IPyramidLeaderboard, IPyramidLeaderboardSearchDto } from "@framework/types";

import { PyramidDepositService } from "../deposit/deposit.service";

@Injectable()
export class PyramidLeaderboardService {
  constructor(private readonly pyramidDepositService: PyramidDepositService) {}

  public async leaderboard(dto: IPyramidLeaderboardSearchDto): Promise<[Array<IPyramidLeaderboard>, number]> {
    return this.pyramidDepositService.leaderboard(dto);
  }
}
