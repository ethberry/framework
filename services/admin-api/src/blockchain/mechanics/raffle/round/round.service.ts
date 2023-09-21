import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { IPaginationDto } from "@gemunion/types-collection";

import { RaffleRoundEntity } from "./round.entity";

@Injectable()
export class RaffleRoundService {
  constructor(
    @InjectRepository(RaffleRoundEntity)
    private readonly roundEntityRepository: Repository<RaffleRoundEntity>,
  ) {}

  public async search(dto: Partial<IPaginationDto>): Promise<[Array<RaffleRoundEntity>, number]> {
    const { skip, take } = dto;

    const queryBuilder = this.roundEntityRepository.createQueryBuilder("round");

    queryBuilder.select();
    queryBuilder.leftJoinAndSelect("round.contract", "contract");

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy("round.createdAt", "DESC");

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<RaffleRoundEntity>,
    options?: FindOneOptions<RaffleRoundEntity>,
  ): Promise<RaffleRoundEntity | null> {
    return this.roundEntityRepository.findOne({ where, ...options });
  }

  public async autocomplete(): Promise<Array<RaffleRoundEntity>> {
    const queryBuilder = this.roundEntityRepository.createQueryBuilder("round");

    queryBuilder.select(["id", "id::VARCHAR as title"]);

    queryBuilder.orderBy({
      "round.createdAt": "DESC",
    });

    return queryBuilder.getRawMany();
  }
}
