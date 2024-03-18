import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { IPaginationDto } from "@gemunion/types-collection";

import { PredictionAnswerEntity } from "./answer.entity";

@Injectable()
export class PredictionAnswerService {
  constructor(
    @InjectRepository(PredictionAnswerEntity)
    private readonly predictionAnswerEntityRepository: Repository<PredictionAnswerEntity>,
  ) {}

  public async search(dto: Partial<IPaginationDto>): Promise<[Array<PredictionAnswerEntity>, number]> {
    const { skip, take } = dto;

    const queryBuilder = this.predictionAnswerEntityRepository.createQueryBuilder("answer");

    queryBuilder.select();

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy("answer.createdAt", "DESC");

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<PredictionAnswerEntity>,
    options?: FindOneOptions<PredictionAnswerEntity>,
  ): Promise<PredictionAnswerEntity | null> {
    return this.predictionAnswerEntityRepository.findOne({ where, ...options });
  }
}
