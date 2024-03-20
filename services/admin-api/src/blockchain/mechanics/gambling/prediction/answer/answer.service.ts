import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IPredictionAnswerSearchDto } from "@framework/types";

import { PredictionAnswerEntity } from "./answer.entity";

@Injectable()
export class PredictionAnswerService {
  constructor(
    @InjectRepository(PredictionAnswerEntity)
    private readonly predictionAnswerEntityRepository: Repository<PredictionAnswerEntity>,
  ) {}

  public async search(dto: Partial<IPredictionAnswerSearchDto>): Promise<[Array<PredictionAnswerEntity>, number]> {
    const { skip, take, questionIds } = dto;

    const queryBuilder = this.predictionAnswerEntityRepository.createQueryBuilder("answer");

    queryBuilder.leftJoinAndSelect("answer.question", "question");

    queryBuilder.select();

    if (questionIds) {
      if (questionIds.length === 1) {
        queryBuilder.andWhere("answer.questionId = :questionId", {
          questionId: questionIds[0],
        });
      } else {
        queryBuilder.andWhere("answer.questionId IN(:...questionIds)", { questionIds });
      }
    }

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
