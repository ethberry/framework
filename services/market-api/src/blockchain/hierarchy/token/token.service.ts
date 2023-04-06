import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import {
  ContractFeatures,
  ITokenAutocompleteDto,
  ITokenSearchDto,
  ModuleType,
  TokenAttributes,
  TokenRarity,
  TokenStatus,
  TokenType,
} from "@framework/types";

import { TokenEntity } from "./token.entity";
import { UserEntity } from "../../../infrastructure/user/user.entity";

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    protected readonly tokenEntityRepository: Repository<TokenEntity>,
  ) {}

  public async search(
    dto: ITokenSearchDto,
    userEntity: UserEntity,
    contractType: TokenType | Array<TokenType>,
    contractModule: ModuleType,
    contractFeatures: Array<ContractFeatures> = [],
  ): Promise<[Array<TokenEntity>, number]> {
    const {
      query,
      attributes = {},
      contractIds,
      templateIds,
      account = userEntity.wallet?.toLowerCase(),
      skip,
      take,
    } = dto;

    const queryBuilder = this.tokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("token.balance", "balance");
    queryBuilder.leftJoinAndSelect("token.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");
    queryBuilder.leftJoinAndSelect("contract.rent", "rent");
    queryBuilder.leftJoinAndSelect("rent.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");
    queryBuilder.leftJoinAndSelect("price_template.tokens", "price_template_tokens");

    if (Array.isArray(contractType)) {
      queryBuilder.andWhere(`contract.contractType IN(:...contractType)`, { contractType });
    } else {
      queryBuilder.andWhere("contract.contractType = :contractType", {
        contractType,
      });
    }

    if (contractFeatures.length > 0) {
      if (contractFeatures.length === 1) {
        queryBuilder.andWhere(":contractFeature = ANY(contract.contractFeatures)", {
          contractFeature: contractFeatures[0],
        });
      } else {
        queryBuilder.andWhere("contract.contractFeatures && :contractFeatures", { contractFeatures });
      }
    }

    queryBuilder.andWhere("contract.contractModule = :contractModule", {
      contractModule,
    });
    queryBuilder.andWhere("contract.chainId = :chainId", {
      chainId: userEntity.chainId,
    });

    if (account) {
      queryBuilder.andWhere("balance.account = :account", { account });
    }

    const rarity = attributes[TokenAttributes.RARITY];
    if (rarity) {
      if (rarity.length === 1) {
        queryBuilder.andWhere(`token.attributes->>'${TokenAttributes.RARITY}' = :rarity`, {
          rarity: Object.values(TokenRarity).findIndex(r => r === rarity[0]),
        });
      } else {
        queryBuilder.andWhere(`token.attributes->>'${TokenAttributes.RARITY}' IN(:...rarity)`, {
          rarity: rarity.map(e => Object.values(TokenRarity).findIndex(r => r === e)),
        });
      }
    }

    const grade = attributes[TokenAttributes.GRADE];
    if (grade) {
      if (grade.length === 1) {
        queryBuilder.andWhere(`token.attributes->>'${TokenAttributes.GRADE}' = :grade`, {
          grade: grade[0],
        });
      } else {
        queryBuilder.andWhere(`token.attributes->>'${TokenAttributes.GRADE}' IN(:...grade)`, { grade });
      }
    }

    queryBuilder.andWhere("token.tokenStatus = :tokenStatus", { tokenStatus: TokenStatus.MINTED });

    if (contractIds) {
      if (contractIds.length === 1) {
        queryBuilder.andWhere("template.contractId = :contractId", {
          contractId: contractIds[0],
        });
      } else {
        queryBuilder.andWhere("template.contractId IN(:...contractIds)", { contractIds });
      }
    }

    if (templateIds) {
      if (templateIds.length === 1) {
        queryBuilder.andWhere("token.templateId = :templateId", {
          templateId: templateIds[0],
        });
      } else {
        queryBuilder.andWhere("token.templateId IN(:...templateIds)", { templateIds });
      }
    }

    if (query) {
      queryBuilder.leftJoin(
        qb => {
          qb.getQuery = () => `LATERAL json_array_elements(template.description->'blocks')`;
          return qb;
        },
        `blocks`,
        `TRUE`,
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

    queryBuilder.orderBy({
      "token.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(dto: ITokenAutocompleteDto, userEntity: UserEntity): Promise<Array<TokenEntity>> {
    const { contractIds, templateIds } = dto;
    const queryBuilder = this.tokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select(["token.id", "token.tokenId"]);

    queryBuilder.leftJoin("token.balance", "balance");
    queryBuilder.addSelect(["balance.account"]);

    queryBuilder.andWhere("balance.account = :account", { account: userEntity.wallet });

    queryBuilder.leftJoin("token.template", "template");
    queryBuilder.addSelect(["template.title", "template.id"]);

    queryBuilder.leftJoin("template.contract", "contract");
    queryBuilder.addSelect(["contract.address", "contract.contractType"]);

    queryBuilder.andWhere("contract.chainId = :chainId", {
      chainId: userEntity.chainId,
    });

    if (contractIds) {
      if (contractIds.length === 1) {
        queryBuilder.andWhere("template.contractId = :contractId", {
          contractId: contractIds[0],
        });
      } else {
        queryBuilder.andWhere("template.contractId IN(:...contractIds)", { contractIds });
      }
    }

    if (templateIds) {
      if (templateIds.length === 1) {
        queryBuilder.andWhere("token.templateId = :templateId", {
          templateId: templateIds[0],
        });
      } else {
        queryBuilder.andWhere("token.templateId IN(:...templateIds)", { templateIds });
      }
    }

    queryBuilder.orderBy({
      "token.createdAt": "DESC",
    });

    return queryBuilder.getMany();
  }

  public findOne(
    where: FindOptionsWhere<TokenEntity>,
    options?: FindOneOptions<TokenEntity>,
  ): Promise<TokenEntity | null> {
    return this.tokenEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<TokenEntity>): Promise<TokenEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "token",
        leftJoinAndSelect: {
          exchange: "token.exchange",
          history: "token.history",
          asset_component_history: "exchange.history",
          asset_component_history_assets: "asset_component_history.assets",
          assets_token: "asset_component_history_assets.token",
          assets_contract: "asset_component_history_assets.contract",
          template: "token.template",
          contract: "template.contract",
          price: "template.price",
          price_components: "price.components",
          price_contract: "price_components.contract",
          price_template: "price_components.template",
          rent: "contract.rent",
          rent_price: "rent.price",
          rent_price_components: "rent_price.components",
          rent_price_components_contract: "rent_price_components.contract",
          rent_price_components_template: "rent_price_components.template",
          rent_price_components_template_tokens: "rent_price_components_template.tokens",
          // breeds: "token.breeds",
          // breed_childs: "breeds.children",
          // breed_history: "breed_childs.history",
        },
      },
    });
  }
}
