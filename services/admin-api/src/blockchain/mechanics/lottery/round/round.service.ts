import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { IPaginationDto } from "@gemunion/types-collection";

import { LotteryRoundEntity } from "./round.entity";

@Injectable()
export class LotteryRoundService {
  constructor(
    @InjectRepository(LotteryRoundEntity)
    private readonly roundEntityRepository: Repository<LotteryRoundEntity>,
  ) {}

  public async search(dto: Partial<IPaginationDto>): Promise<[Array<LotteryRoundEntity>, number]> {
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
    where: FindOptionsWhere<LotteryRoundEntity>,
    options?: FindOneOptions<LotteryRoundEntity>,
  ): Promise<LotteryRoundEntity | null> {
    return this.roundEntityRepository.findOne({ where, ...options });
  }

  public async autocomplete(): Promise<Array<LotteryRoundEntity>> {
    const queryBuilder = this.roundEntityRepository.createQueryBuilder("round");

    queryBuilder.select(["id", "id::VARCHAR as title"]);

    queryBuilder.orderBy({
      "round.createdAt": "DESC",
    });

    return queryBuilder.getRawMany();
  }
}
