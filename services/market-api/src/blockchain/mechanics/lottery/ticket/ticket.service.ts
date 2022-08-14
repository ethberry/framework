import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ILotteryLeaderboard, ILotteryTicketSearchDto } from "@framework/types";
import { ns } from "@framework/constants";

import { LotteryTicketEntity } from "./ticket.entity";
import { ILotteryLeaderboardSearchDto } from "../leaderboard/interfaces/search";
import { UserEntity } from "../../../../user/user.entity";

@Injectable()
export class LotteryTicketService {
  constructor(
    @InjectRepository(LotteryTicketEntity)
    private readonly ticketEntityRepository: Repository<LotteryTicketEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async search(
    dto: Partial<ILotteryTicketSearchDto>,
    userEntity: UserEntity,
  ): Promise<[Array<LotteryTicketEntity>, number]> {
    const { roundIds, skip, take } = dto;

    const queryBuilder = this.ticketEntityRepository.createQueryBuilder("ticket");
    queryBuilder.leftJoinAndSelect("ticket.round", "round");

    queryBuilder.select();

    queryBuilder.andWhere("ticket.account = :account", { account: userEntity.wallet });

    if (roundIds) {
      if (roundIds.length === 1) {
        queryBuilder.andWhere("ticket.roundId = :roundId", {
          roundId: roundIds[0],
        });
      } else {
        queryBuilder.andWhere("ticket.roundId IN(:...roundIds)", { roundIds });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy("ticket.createdAt", "DESC");

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<LotteryTicketEntity>,
    options?: FindOneOptions<LotteryTicketEntity>,
  ): Promise<LotteryTicketEntity | null> {
    return this.ticketEntityRepository.findOne({ where, ...options });
  }

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
