import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ILotteryRoundSearchDto } from "@framework/types";

import { LotteryRoundEntity } from "./round.entity";

@Injectable()
export class LotteryRoundService {
  constructor(
    @InjectRepository(LotteryRoundEntity)
    private readonly roundEntityRepository: Repository<LotteryRoundEntity>,
  ) {}

  public async search(dto: Partial<ILotteryRoundSearchDto>): Promise<[Array<LotteryRoundEntity>, number]> {
    const { roundIds, skip, take } = dto;

    const queryBuilder = this.roundEntityRepository.createQueryBuilder("round");

    queryBuilder.select();

    if (roundIds) {
      if (roundIds.length === 1) {
        queryBuilder.andWhere("round.id = :roundId", {
          roundId: roundIds[0],
        });
      } else {
        queryBuilder.andWhere("round.id IN(:...roundIds)", { roundIds });
      }
    }

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
}
