import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository, DeepPartial } from "typeorm";

import { LotteryTicketEntity } from "./ticket.entity";

@Injectable()
export class LotteryTicketService {
  constructor(
    @InjectRepository(LotteryTicketEntity)
    private readonly ticketEntityRepository: Repository<LotteryTicketEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<LotteryTicketEntity>,
    options?: FindOneOptions<LotteryTicketEntity>,
  ): Promise<LotteryTicketEntity | null> {
    return this.ticketEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: DeepPartial<LotteryTicketEntity>): Promise<LotteryTicketEntity> {
    return this.ticketEntityRepository.create(dto).save();
  }
}
