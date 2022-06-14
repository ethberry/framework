import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ISearchDto } from "@gemunion/types-collection";

import { Erc998RecipeEntity } from "./recipe.entity";
import { Erc998RecipeStatus } from "@framework/types";

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Erc998RecipeEntity)
    private readonly recipeEntityRepository: Repository<Erc998RecipeEntity>,
  ) {}

  public search(dto: ISearchDto): Promise<[Array<Erc998RecipeEntity>, number]> {
    const { query, skip, take } = dto;

    const queryBuilder = this.recipeEntityRepository.createQueryBuilder("recipe");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("recipe.erc998Template", "template");
    queryBuilder.leftJoinAndSelect("template.erc998Collection", "collection");
    queryBuilder.leftJoinAndSelect("recipe.ingredients", "ingredients");
    queryBuilder.leftJoinAndSelect("ingredients.erc1155Token", "ingredients_token");
    queryBuilder.leftJoinAndSelect("ingredients_token.erc1155Collection", "ingredients_token_collection");

    queryBuilder.where({
      recipeStatus: Erc998RecipeStatus.ACTIVE,
    });

    if (query) {
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(template.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("template.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<Erc998RecipeEntity>,
    options?: FindOneOptions<Erc998RecipeEntity>,
  ): Promise<Erc998RecipeEntity | null> {
    return this.recipeEntityRepository.findOne({ where, ...options });
  }
}
