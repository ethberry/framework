import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

import { ILotteryLeaderboard } from "@framework/types";
import { ns } from "@framework/constants";

import { LotteryTicketEntity } from "./ticket.entity";
import { ILotteryLeaderboardSearchDto } from "../leaderboard/interfaces/search";

@Injectable()
export class LotteryTicketService {
  constructor(
    @InjectRepository(LotteryTicketEntity)
    private readonly ticketEntityRepository: Repository<LotteryTicketEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async leaderboard(dto: Partial<ILotteryLeaderboardSearchDto>): Promise<[Array<ILotteryLeaderboard>, number]> {
    const { skip, take } = dto;

    const queryString = `
      SELECT
        row_number() OVER (ORDER BY account)::INTEGER id,
        SUM(amount) AS amount,
        COUNT(amount) AS count,
        account
      FROM
        ${ns}.lottery_ticket
      GROUP BY
        account
    `;

    return Promise.all([
      this.entityManager.query(`${queryString} ORDER BY amount DESC OFFSET $1 LIMIT $2`, [skip, take]),
      this.entityManager.query(`SELECT COUNT(DISTINCT(id))::INTEGER as count FROM (${queryString}) as l`),
    ]).then(([list, [{ count }]]) => [list, count]);
  }
}
