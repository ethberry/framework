import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ILotteryTicketSearchDto } from "@framework/types";

import { LotteryTicketEntity } from "./ticket.entity";

@Injectable()
export class LotteryTicketService {
  constructor(
    @InjectRepository(LotteryTicketEntity)
    private readonly ticketEntityRepository: Repository<LotteryTicketEntity>,
  ) {}

  public async search(dto: Partial<ILotteryTicketSearchDto>): Promise<[Array<LotteryTicketEntity>, number]> {
    const { roundIds, skip, take } = dto;

    const queryBuilder = this.ticketEntityRepository.createQueryBuilder("ticket");
    queryBuilder.leftJoinAndSelect("ticket.round", "round");

    queryBuilder.select();

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
}
