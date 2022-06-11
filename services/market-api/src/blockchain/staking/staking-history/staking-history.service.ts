import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";

import { ILeaderboardSearchDto } from "./interfaces/search";

@Injectable()
export class StakingHistoryService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async leaderboard(dto: ILeaderboardSearchDto): Promise<any> {
    const { skip, take, owner } = dto;

    return Promise.resolve({ skip, take, owner });
  }
}
