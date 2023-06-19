import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ns } from "@framework/constants";
import type { ILotteryLeaderboard, ILotteryLeaderboardSearchDto, ILotteryTicketSearchDto } from "@framework/types";
import { ModuleType, TokenMetadata } from "@framework/types";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { TokenService } from "../../../hierarchy/token/token.service";
import { LotteryRoundEntity } from "../round/round.entity";

@Injectable()
export class LotteryTicketService extends TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    protected readonly tokenEntityRepository: Repository<TokenEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(tokenEntityRepository);
  }

  public async search(
    dto: Partial<ILotteryTicketSearchDto>,
    userEntity: UserEntity,
  ): Promise<[Array<TokenEntity>, number]> {
    const { roundIds, skip, take } = dto;

    const queryBuilder = this.tokenEntityRepository.createQueryBuilder("ticket");
    queryBuilder.leftJoinAndSelect("ticket.template", "template");
    queryBuilder.leftJoinAndSelect("ticket.balance", "balance");

    queryBuilder.select();

    queryBuilder.where("contract.contractModule = :contractModule", {
      contractModule: ModuleType.LOTTERY,
    });

    queryBuilder.andWhere("balance.account = :account", { account: userEntity.wallet });

    queryBuilder.leftJoinAndMapOne(
      "ticket.round",
      LotteryRoundEntity,
      "round",
      `(ticket.metadata->>'${TokenMetadata.ROUND}')::numeric = round.round_id`,
    );

    queryBuilder.andWhere("template.contractId = round.ticketContractId");

    if (roundIds) {
      if (roundIds.length === 1) {
        queryBuilder.andWhere("round.roundId = :roundId", {
          roundId: roundIds[0],
        });
      } else {
        queryBuilder.andWhere("round.roundId IN(:...roundIds)", { roundIds });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy("ticket.createdAt", "DESC");

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<TokenEntity>,
    options?: FindOneOptions<TokenEntity>,
  ): Promise<TokenEntity | null> {
    return this.tokenEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<TokenEntity>): Promise<TokenEntity | null> {
    const queryBuilder = this.tokenEntityRepository.createQueryBuilder("ticket");

    queryBuilder.leftJoinAndSelect("ticket.template", "template");
    queryBuilder.leftJoinAndSelect("ticket.balance", "balance");

    queryBuilder.leftJoinAndMapOne(
      "ticket.round",
      LotteryRoundEntity,
      "round",
      `(ticket.metadata->>'${TokenMetadata.ROUND}')::numeric = round.round_id`,
    );

    queryBuilder.andWhere("template.contractId = round.ticketContractId");

    queryBuilder.andWhere("ticket.id = :id", {
      id: where.id,
    });

    return queryBuilder.getOne();
  }

  public async leaderboard(dto: Partial<ILotteryLeaderboardSearchDto>): Promise<[Array<ILotteryLeaderboard>, number]> {
    const { skip, take } = dto;

    const queryString = `
        SELECT row_number() OVER (ORDER BY account)::INTEGER id,
               SUM(amount)   AS                              amount,
               COUNT(amount) AS                              count,
               account
        FROM ${ns}.lottery_ticket
        GROUP BY account
    `;

    return Promise.all([
      this.entityManager.query(`${queryString} ORDER BY amount DESC OFFSET $1 LIMIT $2`, [skip, take]),
      this.entityManager.query(`SELECT COUNT(DISTINCT (id))::INTEGER as count
                                FROM (${queryString}) as l`),
    ]).then(([list, [{ count }]]) => [list, count]);
  }
}
