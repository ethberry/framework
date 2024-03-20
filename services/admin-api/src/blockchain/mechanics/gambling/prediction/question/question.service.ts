import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { IPredictionQuestionSearchDto } from "@framework/types";

import { PredictionQuestionEntity } from "./question.entity";

@Injectable()
export class PredictionQuestionService {
  constructor(
    @InjectRepository(PredictionQuestionEntity)
    private readonly predictionQuestionEntityRepository: Repository<PredictionQuestionEntity>,
  ) {}

  public async search(dto: Partial<IPredictionQuestionSearchDto>): Promise<[Array<PredictionQuestionEntity>, number]> {
    const { skip, take, query, questionStatus } = dto;

    const queryBuilder = this.predictionQuestionEntityRepository.createQueryBuilder("question");

    queryBuilder.select();

    if (query) {
      queryBuilder.leftJoin(
        qb => {
          qb.getQuery = () => `LATERAL json_array_elements(question.description->'blocks')`;
          return qb;
        },
        "blocks",
        "TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("question.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    if (questionStatus) {
      if (questionStatus.length === 1) {
        queryBuilder.andWhere("question.questionStatus = :questionStatus", { productStatus: questionStatus[0] });
      } else {
        queryBuilder.andWhere("question.questionStatus IN(:...questionStatus)", { questionStatus });
      }
    }

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

  public async autocomplete(): Promise<Array<PredictionQuestionEntity>> {
    const queryBuilder = this.predictionQuestionEntityRepository.createQueryBuilder("question");

    queryBuilder.select(["id", "title"]);

    queryBuilder.orderBy({
      "question.createdAt": "DESC",
    });

    return queryBuilder.getRawMany();
  }
}
