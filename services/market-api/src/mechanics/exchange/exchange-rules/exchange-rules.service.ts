import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ISearchDto } from "@gemunion/types-collection";

import { ExchangeStatus } from "@framework/types";
import { ExchangeRulesEntity } from "./exchange-rules.entity";

@Injectable()
export class ExchangeRulesService {
  constructor(
    @InjectRepository(ExchangeRulesEntity)
    private readonly recipeEntityRepository: Repository<ExchangeRulesEntity>,
  ) {}

  public search(dto: ISearchDto): Promise<[Array<ExchangeRulesEntity>, number]> {
    const { query, skip, take } = dto;

    const queryBuilder = this.recipeEntityRepository.createQueryBuilder("recipe");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("recipe.token", "token");
    queryBuilder.leftJoinAndSelect("token.contract", "contract");
    queryBuilder.leftJoinAndSelect("recipe.ingredients", "ingredients");
    queryBuilder.leftJoinAndSelect("ingredients.token", "ingredients_token");
    queryBuilder.leftJoinAndSelect("ingredients_token.contract", "ingredients_token_contract");

    queryBuilder.where({
      exchangeStatus: ExchangeStatus.ACTIVE,
    });

    if (query) {
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(token.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("token.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<ExchangeRulesEntity>,
    options?: FindOneOptions<ExchangeRulesEntity>,
  ): Promise<ExchangeRulesEntity | null> {
    return this.recipeEntityRepository.findOne({ where, ...options });
  }
}
