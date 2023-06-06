import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { RaffleTicketEntity } from "./ticket.entity";

@Injectable()
export class RaffleTicketService {
  constructor(
    @InjectRepository(RaffleTicketEntity)
    private readonly ticketEntityRepository: Repository<RaffleTicketEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<RaffleTicketEntity>,
    options?: FindOneOptions<RaffleTicketEntity>,
  ): Promise<RaffleTicketEntity | null> {
    return this.ticketEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: DeepPartial<RaffleTicketEntity>): Promise<RaffleTicketEntity> {
    return this.ticketEntityRepository.create(dto).save();
  }
}
