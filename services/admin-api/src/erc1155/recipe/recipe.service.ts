import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc1155RecipeStatus, IErc1155RecipeSearchDto } from "@framework/types";

import { Erc1155RecipeEntity } from "./recipe.entity";
import { IErc1155RecipeCreateDto, IErc1155RecipeUpdateDto } from "./interfaces";
import { Erc1155IngredientEntity } from "../ingredient/ingredient.entity";
import { IngredientService } from "../ingredient/ingredient.service";
import { IIngredientsDto } from "./interfaces/ingredients";

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Erc1155RecipeEntity)
    private readonly recipeEntityRepository: Repository<Erc1155RecipeEntity>,
    private readonly ingredientService: IngredientService,
  ) {}

  public search(dto: IErc1155RecipeSearchDto): Promise<[Array<Erc1155RecipeEntity>, number]> {
    const { query, recipeStatus, skip, take } = dto;

    const queryBuilder = this.recipeEntityRepository.createQueryBuilder("recipe");

    queryBuilder.select();

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

    if (recipeStatus) {
      if (recipeStatus.length === 1) {
        queryBuilder.andWhere("recipe.recipeStatus = :recipeStatus", { recipeStatus: recipeStatus[0] });
      } else {
        queryBuilder.andWhere("recipe.recipeStatus IN(:...recipeStatus)", { recipeStatus });
      }
    }

    queryBuilder.leftJoinAndSelect("recipe.erc1155Token", "erc1155Token");
    queryBuilder.leftJoinAndSelect("recipe.ingredients", "ingredients");

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

  public async create(dto: IErc1155RecipeCreateDto): Promise<Erc1155RecipeEntity> {
    const { ingredients, ...rest } = dto;

    const recipeEntity = await this.recipeEntityRepository.create(rest).save();

    // add new
    await Promise.allSettled(ingredients.map(newItem => this.ingredientService.create(newItem, recipeEntity)));

    return recipeEntity;
  }

  public async update(
    where: FindOptionsWhere<Erc1155RecipeEntity>,
    dto: Partial<IErc1155RecipeUpdateDto>,
  ): Promise<Erc1155RecipeEntity> {
    const { ingredients: raw = [], ...rest } = dto;

    const recipeEntity = await this.findOne(where, {
      join: {
        alias: "recipe",
        leftJoinAndSelect: {
          ingredients: "recipe.ingredients",
        },
      },
    });

    if (!recipeEntity) {
      throw new NotFoundException("recipeNotFound");
    }

    if (raw.length) {
      const ingredients = Object.values(
        raw.reduce((memo, current) => {
          if (current.erc1155TokenId.toString() in memo) {
            current.amount += memo[current.erc1155TokenId.toString()].amount;
          }

          memo[current.erc1155TokenId.toString()] = current;
          return memo;
        }, {} as Record<string, IIngredientsDto>),
      );

      // remove old
      await Promise.allSettled(
        recipeEntity.ingredients
          .filter(oldItem => !ingredients.find(newItem => newItem.erc1155TokenId === oldItem.erc1155TokenId))
          .map(oldItem => oldItem.remove()),
      );

      // change existing
      const changedingredients = await Promise.allSettled(
        recipeEntity.ingredients
          .filter(oldItem => ingredients.find(newItem => newItem.erc1155TokenId === oldItem.erc1155TokenId))
          .map(oldItem => {
            oldItem.amount = ingredients.find(newItem => newItem.erc1155TokenId === oldItem.erc1155TokenId)!.amount;
            return oldItem.save();
          }),
      ).then(values =>
        values
          .filter(c => c.status === "fulfilled")
          .map(c => <PromiseFulfilledResult<Erc1155IngredientEntity>>c)
          .map(c => c.value),
      );

      // add new
      const newingredients = await Promise.allSettled(
        ingredients
          .filter(
            newItem => !recipeEntity.ingredients.find(oldItem => newItem.erc1155TokenId === oldItem.erc1155TokenId),
          )
          .map(newItem => this.ingredientService.create(newItem, recipeEntity)),
      ).then(values =>
        values
          .filter(c => c.status === "fulfilled")
          .map(c => <PromiseFulfilledResult<Erc1155IngredientEntity>>c)
          .map(c => c.value),
      );

      Object.assign(recipeEntity, { ingredients: [...changedingredients, ...newingredients] });
    }

    Object.assign(recipeEntity, rest);

    return recipeEntity.save();
  }

  public delete(where: FindOptionsWhere<Erc1155RecipeEntity>): Promise<Erc1155RecipeEntity> {
    return this.update(where, { recipeStatus: Erc1155RecipeStatus.INACTIVE });
  }
}
