import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { AssetType, ExchangeStatus, IExchangeSearchDto } from "@framework/types";

import { CraftEntity } from "./craft.entity";
import { IRecipeCreateDto, IRecipeUpdateDto } from "./interfaces";
import { AssetService } from "../asset/asset.service";

@Injectable()
export class CraftService {
  constructor(
    @InjectRepository(CraftEntity)
    private readonly recipeEntityRepository: Repository<CraftEntity>,
    private readonly assetService: AssetService,
  ) {}

  public search(dto: IExchangeSearchDto): Promise<[Array<CraftEntity>, number]> {
    const { query, exchangeStatus, skip, take } = dto;

    const queryBuilder = this.recipeEntityRepository.createQueryBuilder("rule");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("rule.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "components");
    queryBuilder.leftJoinAndSelect("components.token", "token");
    queryBuilder.leftJoinAndSelect("token.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");

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

    if (exchangeStatus) {
      if (exchangeStatus.length === 1) {
        queryBuilder.andWhere("rule.exchangeStatus = :exchangeStatus", { exchangeStatus: exchangeStatus[0] });
      } else {
        queryBuilder.andWhere("rule.exchangeStatus IN(:...exchangeStatus)", { exchangeStatus });
      }
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

  public async create(dto: IRecipeCreateDto): Promise<CraftEntity> {
    const { ingredients, item } = dto;

    // add new ingredient
    const ingredientsEntity = await this.assetService.create({
      assetType: AssetType.EXCHANGE,
      externalId: "0",
      components: [],
    });
    await this.assetService.update(ingredientsEntity, ingredients);

    // add new item
    const itemEntity = await this.assetService.create({
      assetType: AssetType.EXCHANGE,
      externalId: "0",
      components: [],
    });
    await this.assetService.update(itemEntity, item);

    return this.recipeEntityRepository
      .create({
        ingredients: ingredientsEntity,
        item: itemEntity,
      })
      .save();
  }

  public async update(where: FindOptionsWhere<CraftEntity>, dto: Partial<IRecipeUpdateDto>): Promise<CraftEntity> {
    const { ingredients, ...rest } = dto;

    const exchangeEntity = await this.findOne(where, {
      join: {
        alias: "recipe",
        leftJoinAndSelect: {
          ingredients: "recipe.ingredients",
        },
      },
    });

    if (!exchangeEntity) {
      throw new NotFoundException("exchangeRulesNotFound");
    }

    if (ingredients) {
      await this.assetService.update(exchangeEntity.ingredients, ingredients);
    }

    Object.assign(exchangeEntity, rest);

    return exchangeEntity.save();
  }

  public async delete(where: FindOptionsWhere<CraftEntity>): Promise<void> {
    const recipeEntity = await this.findOne(where);

    if (!recipeEntity) {
      return;
    }

    if (recipeEntity.exchangeStatus === ExchangeStatus.NEW) {
      await recipeEntity.remove();
    } else {
      Object.assign(recipeEntity, { exchangeStatus: ExchangeStatus.INACTIVE });
      await recipeEntity.save();
    }
  }
}
