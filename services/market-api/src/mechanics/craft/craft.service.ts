import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ISearchDto } from "@gemunion/types-collection";
import { CraftStatus } from "@framework/types";

import { CraftEntity } from "./craft.entity";

@Injectable()
export class CraftService {
  constructor(
    @InjectRepository(CraftEntity)
    private readonly recipeEntityRepository: Repository<CraftEntity>,
  ) {}

  public search(dto: ISearchDto): Promise<[Array<CraftEntity>, number]> {
    const { query, skip, take } = dto;

    const queryBuilder = this.recipeEntityRepository.createQueryBuilder("recipe");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("recipe.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.token", "item_token");
    queryBuilder.leftJoinAndSelect("item_token.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");

    queryBuilder.leftJoinAndSelect("recipe.ingredients", "ingredients");
    queryBuilder.leftJoinAndSelect("ingredients.components", "ingredients_components");
    queryBuilder.leftJoinAndSelect("ingredients_components.token", "ingredients_token");
    queryBuilder.leftJoinAndSelect("ingredients_token.template", "ingredients_template");
    queryBuilder.leftJoinAndSelect("ingredients_components.contract", "ingredients_contract");

    // queryBuilder.leftJoinAndSelect("token.contract", "contract");
    // queryBuilder.leftJoinAndSelect("recipe.ingredients", "ingredients");
    // queryBuilder.leftJoinAndSelect("ingredients.token", "ingredients_token");
    // queryBuilder.leftJoinAndSelect("ingredients_token.contract", "ingredients_token_contract");

    queryBuilder.where({
      craftStatus: CraftStatus.ACTIVE,
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
    where: FindOptionsWhere<CraftEntity>,
    options?: FindOneOptions<CraftEntity>,
  ): Promise<CraftEntity | null> {
    return this.recipeEntityRepository.findOne({ where, ...options });
  }
}
