import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { IPaginationDto } from "@ethberry/types-collection";

import { PredictionQuestionEntity } from "./question.entity";

@Injectable()
export class PredictionQuestionService {
  constructor(
    @InjectRepository(PredictionQuestionEntity)
    private readonly predictionQuestionEntityRepository: Repository<PredictionQuestionEntity>,
  ) {}

  public async search(dto: Partial<IPaginationDto>): Promise<[Array<PredictionQuestionEntity>, number]> {
    const { skip, take } = dto;

    const queryBuilder = this.predictionQuestionEntityRepository.createQueryBuilder("question");

    queryBuilder.select();

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy("question.createdAt", "DESC");

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<PredictionQuestionEntity>,
    options?: FindOneOptions<PredictionQuestionEntity>,
  ): Promise<PredictionQuestionEntity | null> {
    return this.predictionQuestionEntityRepository.findOne({ where, ...options });
  }
}
