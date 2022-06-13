import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ISearchDto } from "@gemunion/types-collection";

import { Erc721RecipeEntity } from "./recipe.entity";
import { Erc721RecipeStatus } from "@framework/types";

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Erc721RecipeEntity)
    private readonly recipeEntityRepository: Repository<Erc721RecipeEntity>,
  ) {}

  public search(dto: ISearchDto): Promise<[Array<Erc721RecipeEntity>, number]> {
    const { query, skip, take } = dto;

    const queryBuilder = this.recipeEntityRepository.createQueryBuilder("recipe");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("recipe.erc721Template", "template");
    queryBuilder.leftJoinAndSelect("template.erc721Collection", "collection");
    queryBuilder.leftJoinAndSelect("recipe.ingredients", "ingredients");
    queryBuilder.leftJoinAndSelect("ingredients.erc1155Token", "ingredients_token");
    queryBuilder.leftJoinAndSelect("ingredients_token.erc1155Collection", "ingredients_token_collection");

    queryBuilder.where({
      recipeStatus: Erc721RecipeStatus.ACTIVE,
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
    where: FindOptionsWhere<Erc721RecipeEntity>,
    options?: FindOneOptions<Erc721RecipeEntity>,
  ): Promise<Erc721RecipeEntity | null> {
    return this.recipeEntityRepository.findOne({ where, ...options });
  }
}
