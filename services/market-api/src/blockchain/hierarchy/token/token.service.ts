import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import {
  ITokenAutocompleteDto,
  ITokenSearchDto,
  ModuleType,
  TokenAttributes,
  TokenRarity,
  TokenStatus,
  TokenType,
} from "@framework/types";

import { TokenEntity } from "./token.entity";
import { UserEntity } from "../../../user/user.entity";

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    protected readonly tokenEntityRepository: Repository<TokenEntity>,
  ) {}

  public async search(
    dto: ITokenSearchDto,
    userEntity: UserEntity,
    contractType: TokenType,
    contractModule: ModuleType,
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

    queryBuilder.andWhere("contract.contractType = :contractType", {
      contractType,
    });
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

    queryBuilder.orderBy({
      "token.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(dto: ITokenAutocompleteDto): Promise<Array<TokenEntity>> {
    const { account, contractIds, templateIds } = dto;
    const queryBuilder = this.tokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select(["token.id", "token.tokenId"]);

    if (account) {
      queryBuilder.andWhere("token.account = :account", { account });
    }

    queryBuilder.leftJoin("token.template", "template");
    queryBuilder.addSelect(["template.title"]);

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

    queryBuilder.leftJoin("template.contract", "contract");
    queryBuilder.addSelect(["contract.address"]);

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
          history: "token.history",
          template: "token.template",
          contract: "template.contract",
          price: "template.price",
          price_components: "price.components",
          price_contract: "price_components.contract",
          price_template: "price_components.template",
        },
      },
    });
  }
}
