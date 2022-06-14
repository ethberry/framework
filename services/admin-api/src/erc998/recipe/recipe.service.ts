import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc998RecipeStatus, IErc998RecipeSearchDto } from "@framework/types";

import { Erc998RecipeEntity } from "./recipe.entity";
import { IErc998RecipeCreateDto, IErc998RecipeUpdateDto } from "./interfaces";
import { Erc998IngredientEntity } from "./ingredient/ingredient.entity";
import { IngredientService } from "./ingredient/ingredient.service";
import { IIngredientsDto } from "./interfaces/ingredients";

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Erc998RecipeEntity)
    private readonly recipeEntityRepository: Repository<Erc998RecipeEntity>,
    private readonly ingredientService: IngredientService,
  ) {}

  public search(dto: IErc998RecipeSearchDto): Promise<[Array<Erc998RecipeEntity>, number]> {
    const { query, recipeStatus, skip, take } = dto;

    const queryBuilder = this.recipeEntityRepository.createQueryBuilder("recipe");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("recipe.erc998Template", "template");
    queryBuilder.leftJoinAndSelect("template.erc998Collection", "templateCollection");
    queryBuilder.leftJoinAndSelect("recipe.erc998Dropbox", "dropbox");
    queryBuilder.leftJoinAndSelect("dropbox.erc998Collection", "dropboxCollection");
    queryBuilder.leftJoinAndSelect("dropbox.erc998Template", "dropboxTemplate");
    queryBuilder.leftJoinAndSelect("dropboxTemplate.erc998Collection", "dropboxTemplateCollection");
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
    where: FindOptionsWhere<Erc998RecipeEntity>,
    options?: FindOneOptions<Erc998RecipeEntity>,
  ): Promise<Erc998RecipeEntity | null> {
    return this.recipeEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IErc998RecipeCreateDto): Promise<Erc998RecipeEntity> {
    const { ingredients, ...rest } = dto;

    // TODO get template by dropbox

    const recipeEntity = await this.recipeEntityRepository.create(rest).save();

    // add new
    await Promise.allSettled(ingredients.map(newItem => this.ingredientService.create(newItem, recipeEntity)));

    return recipeEntity;
  }

  public async update(
    where: FindOptionsWhere<Erc998RecipeEntity>,
    dto: Partial<IErc998RecipeUpdateDto>,
  ): Promise<Erc998RecipeEntity> {
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
          .map(c => <PromiseFulfilledResult<Erc998IngredientEntity>>c)
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
          .map(c => <PromiseFulfilledResult<Erc998IngredientEntity>>c)
          .map(c => c.value),
      );

      Object.assign(recipeEntity, { ingredients: [...changedingredients, ...newingredients] });
    }

    Object.assign(recipeEntity, rest);

    return recipeEntity.save();
  }

  public async delete(where: FindOptionsWhere<Erc998RecipeEntity>): Promise<void> {
    const recipeEntity = await this.findOne(where);

    if (!recipeEntity) {
      return;
    }

    if (recipeEntity.recipeStatus === Erc998RecipeStatus.NEW) {
      await recipeEntity.remove();
    } else {
      Object.assign(recipeEntity, { recipeStatus: Erc998RecipeStatus.INACTIVE });
      await recipeEntity.save();
    }
  }
}
