import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import {
  ITokenAutocompleteDto,
  ITokenSearchDto,
  ModuleType,
  TokenAttributes,
  TokenRarity,
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
    contractType: TokenType,
    contractModule: ModuleType,
  ): Promise<[Array<TokenEntity>, number]> {
    const { query, tokenStatus, tokenId, attributes = {}, contractIds, templateIds, account, skip, take } = dto;

    const queryBuilder = this.tokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

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
      queryBuilder.leftJoinAndSelect("token.balance", "balance");
      queryBuilder.andWhere("balance.account = :account", { account });
    }

    if (tokenId) {
      queryBuilder.andWhere("token.tokenId = :tokenId", { tokenId });
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

    if (tokenStatus) {
      if (tokenStatus.length === 1) {
        queryBuilder.andWhere("token.tokenStatus = :tokenStatus", { tokenStatus: tokenStatus[0] });
      } else {
        queryBuilder.andWhere("token.tokenStatus IN(:...tokenStatus)", { tokenStatus });
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

    if (contractIds) {
      if (contractIds.length === 1) {
        queryBuilder.andWhere("template.contractId = :contractId", {
          contractId: contractIds[0],
        });
      } else {
        queryBuilder.andWhere("template.contractId IN(:...contractIds)", { contractIds });
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
}
