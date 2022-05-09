import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc721RecipeEntity } from "./recipe.entity";
import { IErc721RecipeCreateDto, IErc721RecipeUpdateDto } from "./interfaces";
import { Erc721IngredientEntity } from "../ingredient/ingredient.entity";
import { IngredientService } from "../ingredient/ingredient.service";
import { IErc721RecipeSearchDto } from "@framework/types";

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Erc721RecipeEntity)
    private readonly recipeEntityRepository: Repository<Erc721RecipeEntity>,
    private readonly ingredientService: IngredientService,
  ) {}

  public search(dto: IErc721RecipeSearchDto): Promise<[Array<Erc721RecipeEntity>, number]> {
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

    queryBuilder.leftJoinAndSelect("recipe.erc721Template", "template");
    queryBuilder.leftJoinAndSelect("recipe.erc721Dropbox", "dropbox");
    queryBuilder.leftJoinAndSelect("dropbox.erc721Template", "dropboxTemplate");
    queryBuilder.leftJoinAndSelect("recipe.ingredients", "ingredients");

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

  public async create(dto: IErc721RecipeCreateDto): Promise<Erc721RecipeEntity> {
    const { ingredients, ...rest } = dto;

    // TODO get template by dropbox

    const recipeEntity = await this.recipeEntityRepository.create(rest).save();

    // add new
    await Promise.allSettled(ingredients.map(newItem => this.ingredientService.create(newItem, recipeEntity)));

    return recipeEntity;
  }

  public async update(
    where: FindOptionsWhere<Erc721RecipeEntity>,
    dto: IErc721RecipeUpdateDto,
  ): Promise<Erc721RecipeEntity> {
    const { ingredients, ...rest } = dto;

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
        .map(c => <PromiseFulfilledResult<Erc721IngredientEntity>>c)
        .map(c => c.value),
    );

    // add new
    const newingredients = await Promise.allSettled(
      ingredients
        .filter(newItem => !recipeEntity.ingredients.find(oldItem => newItem.erc1155TokenId === oldItem.erc1155TokenId))
        .map(newItem => this.ingredientService.create(newItem, recipeEntity)),
    ).then(values =>
      values
        .filter(c => c.status === "fulfilled")
        .map(c => <PromiseFulfilledResult<Erc721IngredientEntity>>c)
        .map(c => c.value),
    );

    Object.assign(recipeEntity, rest, { ingredients: [...changedingredients, ...newingredients] });

    return recipeEntity.save();
  }

  public delete(where: FindOptionsWhere<Erc721RecipeEntity>): Promise<DeleteResult> {
    return this.recipeEntityRepository.delete(where);
  }
}
