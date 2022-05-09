import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ISearchDto } from "@gemunion/types-collection";

import { Erc1155RecipeEntity } from "./recipe.entity";
import { Erc1155RecipeStatus } from "@framework/types";

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Erc1155RecipeEntity)
    private readonly recipeEntityRepository: Repository<Erc1155RecipeEntity>,
  ) {}

  public search(dto: ISearchDto): Promise<[Array<Erc1155RecipeEntity>, number]> {
    const { query, skip, take } = dto;

    const queryBuilder = this.recipeEntityRepository.createQueryBuilder("recipe");

    queryBuilder.select();
    queryBuilder.where({
      recipeStatus: Erc1155RecipeStatus.ACTIVE,
    });
    if (query) {
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(recipe.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("recipe.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    queryBuilder.leftJoinAndSelect("recipe.erc1155Token", "token");
    queryBuilder.leftJoinAndSelect("token.erc1155Collection", "collection");
    queryBuilder.leftJoinAndSelect("recipe.ingredients", "ingredients");
    queryBuilder.leftJoinAndSelect("ingredients.erc1155Token", "ingredients_token");
    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<Erc1155RecipeEntity>,
    options?: FindOneOptions<Erc1155RecipeEntity>,
  ): Promise<Erc1155RecipeEntity | null> {
    return this.recipeEntityRepository.findOne({ where, ...options });
  }
}
