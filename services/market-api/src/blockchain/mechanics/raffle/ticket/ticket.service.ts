import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ns } from "@framework/constants";
import type { IRaffleLeaderboard, IRaffleLeaderboardSearchDto, IRaffleTicketSearchDto } from "@framework/types";

import { RaffleTicketEntity } from "./ticket.entity";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@Injectable()
export class RaffleTicketService {
  constructor(
    @InjectRepository(RaffleTicketEntity)
    private readonly ticketEntityRepository: Repository<RaffleTicketEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async search(
    dto: Partial<IRaffleTicketSearchDto>,
    userEntity: UserEntity,
  ): Promise<[Array<RaffleTicketEntity>, number]> {
    const { roundIds, skip, take } = dto;

    const queryBuilder = this.ticketEntityRepository.createQueryBuilder("ticket");
    queryBuilder.leftJoinAndSelect("ticket.round", "round");
    queryBuilder.leftJoinAndSelect("ticket.token", "token");

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
    where: FindOptionsWhere<RaffleTicketEntity>,
    options?: FindOneOptions<RaffleTicketEntity>,
  ): Promise<RaffleTicketEntity | null> {
    return this.ticketEntityRepository.findOne({ where, ...options });
  }

  public async leaderboard(dto: Partial<IRaffleLeaderboardSearchDto>): Promise<[Array<IRaffleLeaderboard>, number]> {
    const { skip, take } = dto;

    const queryString = `
        SELECT row_number() OVER (ORDER BY account)::INTEGER id,
               SUM(amount)   AS                              amount,
               COUNT(amount) AS                              count,
               account
        FROM ${ns}.raffle_ticket
        GROUP BY account
    `;

    return Promise.all([
      this.entityManager.query(`${queryString} ORDER BY amount DESC OFFSET $1 LIMIT $2`, [skip, take]),
      this.entityManager.query(`SELECT COUNT(DISTINCT (id))::INTEGER as count
                                FROM (${queryString}) as l`),
    ]).then(([list, [{ count }]]) => [list, count]);
  }
}
