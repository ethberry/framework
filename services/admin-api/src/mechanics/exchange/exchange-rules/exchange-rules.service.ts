import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ExchangeStatus, IExchangeSearchDto } from "@framework/types";

import { ExchangeRulesEntity } from "./exchange-rules.entity";
import { IExchangeCreateDto, IExchangeUpdateDto } from "./interfaces";
import { AssetService } from "../../../blockchain/asset/asset.service";

@Injectable()
export class ExchangeRulesService {
  constructor(
    @InjectRepository(ExchangeRulesEntity)
    private readonly recipeEntityRepository: Repository<ExchangeRulesEntity>,
    private readonly assetService: AssetService,
  ) {}

  public search(dto: IExchangeSearchDto): Promise<[Array<ExchangeRulesEntity>, number]> {
    const { query, exchangeStatus, skip, take } = dto;

    const queryBuilder = this.recipeEntityRepository.createQueryBuilder("rule");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("rule.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "components");
    queryBuilder.leftJoinAndSelect("components.uniToken", "token");
    queryBuilder.leftJoinAndSelect("token.uniTemplate", "template");
    queryBuilder.leftJoinAndSelect("components.uniContract", "contract");

    queryBuilder.leftJoinAndSelect("rule.ingredients", "ingredients");
    // queryBuilder.leftJoinAndSelect("template.erc721Collection", "templateCollection");
    // queryBuilder.leftJoinAndSelect("recipe.erc721Dropbox", "dropbox");
    // queryBuilder.leftJoinAndSelect("dropbox.erc721Collection", "dropboxCollection");
    // queryBuilder.leftJoinAndSelect("dropbox.erc721Template", "dropboxTemplate");
    // queryBuilder.leftJoinAndSelect("dropboxTemplate.erc721Collection", "dropboxTemplateCollection");
    // queryBuilder.leftJoinAndSelect("recipe.ingredients", "ingredients");
    // queryBuilder.leftJoinAndSelect("ingredients.erc1155Token", "ingredientsToken");
    // queryBuilder.leftJoinAndSelect("ingredientsToken.erc1155Collection", "ingredientsTokenCollection");

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
    where: FindOptionsWhere<ExchangeRulesEntity>,
    options?: FindOneOptions<ExchangeRulesEntity>,
  ): Promise<ExchangeRulesEntity | null> {
    return this.recipeEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IExchangeCreateDto): Promise<ExchangeRulesEntity> {
    const { ingredients, ...rest } = dto;

    // TODO get template by dropbox

    const recipeEntity = await this.recipeEntityRepository.create(rest).save();

    // add new
    await this.assetService.create({
      ...ingredients,
      externalId: recipeEntity.id,
    });

    return recipeEntity;
  }

  public async update(
    where: FindOptionsWhere<ExchangeRulesEntity>,
    dto: Partial<IExchangeUpdateDto>,
  ): Promise<ExchangeRulesEntity> {
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

  public async delete(where: FindOptionsWhere<ExchangeRulesEntity>): Promise<void> {
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
