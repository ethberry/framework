import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ISearchDto } from "@gemunion/types-collection";

import { ExchangeStatus } from "@framework/types";
import { ExchangeEntity } from "./exchange.entity";

@Injectable()
export class ExchangeService {
  constructor(
    @InjectRepository(ExchangeEntity)
    private readonly recipeEntityRepository: Repository<ExchangeEntity>,
  ) {}

  public search(dto: ISearchDto): Promise<[Array<ExchangeEntity>, number]> {
    const { query, skip, take } = dto;

    const queryBuilder = this.recipeEntityRepository.createQueryBuilder("recipe");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("recipe.erc1155Token", "token");
    queryBuilder.leftJoinAndSelect("token.erc1155Collection", "collection");
    queryBuilder.leftJoinAndSelect("recipe.ingredients", "ingredients");
    queryBuilder.leftJoinAndSelect("ingredients.erc1155Token", "ingredients_token");
    queryBuilder.leftJoinAndSelect("ingredients_token.erc1155Collection", "ingredients_token_collection");

    queryBuilder.where({
      recipeStatus: ExchangeStatus.ACTIVE,
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
    where: FindOptionsWhere<ExchangeEntity>,
    options?: FindOneOptions<ExchangeEntity>,
  ): Promise<ExchangeEntity | null> {
    return this.recipeEntityRepository.findOne({ where, ...options });
  }
}
