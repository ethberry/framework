import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { ISearchDto } from "@ethberry/types-collection";

import { PredictionQuestionEntity } from "./question.entity";

@Injectable()
export class PredictionQuestionService {
  constructor(
    @InjectRepository(PredictionQuestionEntity)
    private readonly predictionQuestionEntityRepository: Repository<PredictionQuestionEntity>,
  ) {}

  public async search(dto: Partial<ISearchDto>): Promise<[Array<PredictionQuestionEntity>, number]> {
    const { skip, take, query } = dto;

    const queryBuilder = this.predictionQuestionEntityRepository.createQueryBuilder("question");

    if (query) {
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("question.title ILIKE '%' || :query || '%'", { query });
        }),
      );
    }

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
