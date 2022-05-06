import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";

import { ns } from "@framework/constants";
import { IErc20LeaderboardSearchDto } from "@framework/types";
import { ILeaderboard } from "./interfaces";

@Injectable()
export class Erc20StakingHistoryService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async leaderboard(dto: IErc20LeaderboardSearchDto): Promise<[Array<ILeaderboard>, number]> {
    const { skip, take, owner } = dto;

    const queryData = `
      SELECT
        COUNT(event_data->>'owner') as count,
        SUM((event_data->>'amount')::numeric) as sum,
        event_data->>'owner' as owner
      FROM ${ns}.erc20_staking_history
      ${owner ? `WHERE event_data->>'owner' = '${owner}'` : ""}
      GROUP BY owner
      ORDER BY sum DESC
      LIMIT ${take} OFFSET ${skip}
    `;

    const queryCount = `
      SELECT
        COUNT(event_data->>'owner') as count
      FROM ${ns}.erc20_staking_history
    `;

    return Promise.all([
      this.entityManager.query(queryData),
      this.entityManager.query(queryCount).then((result: Array<{ count: number }>) => result[0].count),
    ]) as Promise<[Array<ILeaderboard>, number]>;
  }
}
