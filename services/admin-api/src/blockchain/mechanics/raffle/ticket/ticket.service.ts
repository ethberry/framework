import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IRaffleTicketSearchDto } from "@framework/types";

import { RaffleTicketEntity } from "./ticket.entity";

@Injectable()
export class RaffleTicketService {
  constructor(
    @InjectRepository(RaffleTicketEntity)
    private readonly ticketEntityRepository: Repository<RaffleTicketEntity>,
  ) {}

  public async search(dto: Partial<IRaffleTicketSearchDto>): Promise<[Array<RaffleTicketEntity>, number]> {
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
    where: FindOptionsWhere<RaffleTicketEntity>,
    options?: FindOneOptions<RaffleTicketEntity>,
  ): Promise<RaffleTicketEntity | null> {
    return this.ticketEntityRepository.findOne({ where, ...options });
  }
}
