import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc721RecipeStatus, IErc721RecipeSearchDto } from "@framework/types";

import { Erc721RecipeEntity } from "./recipe.entity";
import { IErc721RecipeCreateDto, IErc721RecipeUpdateDto } from "./interfaces";
import { Erc721IngredientEntity } from "./ingredient/ingredient.entity";
import { IngredientService } from "./ingredient/ingredient.service";
import { IIngredientsDto } from "./interfaces/ingredients";

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

    queryBuilder.leftJoinAndSelect("recipe.erc721Template", "template");
    queryBuilder.leftJoinAndSelect("template.erc721Collection", "templateCollection");
    queryBuilder.leftJoinAndSelect("recipe.erc721Dropbox", "dropbox");
    queryBuilder.leftJoinAndSelect("dropbox.erc721Collection", "dropboxCollection");
    queryBuilder.leftJoinAndSelect("dropbox.erc721Template", "dropboxTemplate");
    queryBuilder.leftJoinAndSelect("dropboxTemplate.erc721Collection", "dropboxTemplateCollection");
    queryBuilder.leftJoinAndSelect("recipe.ingredients", "ingredients");
    queryBuilder.leftJoinAndSelect("ingredients.erc1155Token", "ingredientsToken");
    queryBuilder.leftJoinAndSelect("ingredientsToken.erc1155Collection", "ingredientsTokenCollection");

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

    if (recipeStatus) {
      if (recipeStatus.length === 1) {
        queryBuilder.andWhere("recipe.recipeStatus = :recipeStatus", { recipeStatus: recipeStatus[0] });
      } else {
        queryBuilder.andWhere("recipe.recipeStatus IN(:...recipeStatus)", { recipeStatus });
      }
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
    dto: Partial<IErc721RecipeUpdateDto>,
  ): Promise<Erc721RecipeEntity> {
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
          .map(c => <PromiseFulfilledResult<Erc721IngredientEntity>>c)
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
          .map(c => <PromiseFulfilledResult<Erc721IngredientEntity>>c)
          .map(c => c.value),
      );

      Object.assign(recipeEntity, { ingredients: [...changedingredients, ...newingredients] });
    }

    Object.assign(recipeEntity, rest);

    return recipeEntity.save();
  }

  public async delete(where: FindOptionsWhere<Erc721RecipeEntity>): Promise<void> {
    const recipeEntity = await this.findOne(where);

    if (!recipeEntity) {
      return;
    }

    if (recipeEntity.recipeStatus === Erc721RecipeStatus.NEW) {
      await recipeEntity.remove();
    } else {
      Object.assign(recipeEntity, { recipeStatus: Erc721RecipeStatus.INACTIVE });
      await recipeEntity.save();
    }
  }
}
