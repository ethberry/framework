import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";

import { ILeaderboardSearchDto } from "./interfaces/search";
import { StakingRulesEntity } from "../staking-rules/staking-rules.entity";

@Injectable()
export class StakingHistoryService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async leaderboard(dto: ILeaderboardSearchDto): Promise<[Array<StakingRulesEntity>, number]> {
    // const { skip, take, owner } = dto;
    console.info("dto", dto);
    // todo get it work
    return Promise.resolve([[], 0]);
  }
}
