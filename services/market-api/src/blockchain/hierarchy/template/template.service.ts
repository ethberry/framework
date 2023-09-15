import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ArrayOverlap, Brackets, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";

import type { ITemplateAutocompleteDto, ITemplateSearchDto } from "@framework/types";
import { ContractFeatures, ContractStatus, ModuleType, TemplateStatus, TokenType } from "@framework/types";
import { defaultChainId } from "@framework/constants";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { TemplateEntity } from "./template.entity";

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(TemplateEntity)
    protected readonly templateEntityRepository: Repository<TemplateEntity>,
  ) {}

  public async search(
    dto: Partial<ITemplateSearchDto>,
    userEntity: UserEntity,
    contractModule: Array<ModuleType>,
    contractType: Array<TokenType> | null,
  ): Promise<[Array<TemplateEntity>, number]> {
    const { query, skip, take, contractIds, minPrice, maxPrice } = dto;

    const queryBuilder = this.templateEntityRepository.createQueryBuilder("template");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("template.contract", "contract");
    queryBuilder.leftJoinAndSelect("contract.merchant", "merchant");

    // get single token for ERC1155, to use in purchase
    queryBuilder.leftJoinAndSelect("template.tokens", "tokens", "contract.contractType = :tokenType", {
      tokenType: TokenType.ERC1155,
    });

    // do not display external contracts as there is no wat to mint tokens from it
    queryBuilder.andWhere("NOT(:contractFeature = ANY(contract.contractFeatures))", {
      contractFeature: ContractFeatures.EXTERNAL,
    });

    queryBuilder.leftJoinAndSelect("template.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");

    queryBuilder.leftJoinAndSelect(
      "price_template.tokens",
      "price_tokens",
      "price_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    );

    if (contractType) {
      if (contractType.length === 1) {
        queryBuilder.andWhere("contract.contractType = :contractType", { contractType: contractType[0] });
      } else {
        queryBuilder.andWhere("contract.contractType IN(:...contractType)", { contractType });
      }
    } else if (contractType === null) {
      queryBuilder.andWhere("contract.contractType IS NULL");
    }

    if (contractModule) {
      if (contractModule.length === 1) {
        queryBuilder.andWhere("contract.contractModule = :contractModule", { contractModule: contractModule[0] });
      } else {
        queryBuilder.andWhere("contract.contractModule IN(:...contractModule)", { contractModule });
      }
    }

    queryBuilder.andWhere("contract.contractStatus = :contractStatus", {
      contractStatus: ContractStatus.ACTIVE,
    });

    queryBuilder.andWhere("contract.chainId = :chainId", {
      chainId: userEntity?.chainId || Number(defaultChainId),
    });

    queryBuilder.andWhere("contract.isPaused = :isPaused", {
      isPaused: false,
    });

    queryBuilder.andWhere("template.templateStatus = :templateStatus", {
      templateStatus: TemplateStatus.ACTIVE,
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

    if (minPrice || maxPrice) {
      queryBuilder.leftJoin("price.components", "price_filter");

      if (maxPrice) {
        queryBuilder.andWhere("price_filter.amount <= :maxPrice", { maxPrice });
      }

      if (minPrice) {
        queryBuilder.andWhere("price_filter.amount >= :minPrice", { minPrice });
      }
    }

    queryBuilder.andWhere(
      new Brackets(qb => {
        qb.where("template.amount = 0");
        qb.orWhere("template.amount > template.cap");
      }),
    );

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "template.createdAt": "DESC",
      "template.id": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(dto: ITemplateAutocompleteDto, userEntity: UserEntity): Promise<Array<TemplateEntity>> {
    const {
      contractFeatures = [],
      templateStatus = [],
      contractIds = [],
      contractModule = [],
      contractType = [],
    } = dto;

    const where = {
      contract: {
        chainId: userEntity.chainId,
      },
    };

    if (contractType.length) {
      Object.assign(where.contract, {
        contractType: In(contractType),
      });
    }

    if (contractModule.length) {
      Object.assign(where.contract, {
        contractModule: In(contractModule),
      });
    }

    if (contractFeatures.length) {
      Object.assign(where.contract, {
        // https://github.com/typeorm/typeorm/blob/master/docs/find-options.md
        contractFeatures: ArrayOverlap(contractFeatures),
      });
    }

    if (templateStatus.length) {
      Object.assign(where, {
        templateStatus: In(templateStatus),
      });
    }

    if (contractIds.length) {
      Object.assign(where, {
        contractId: In(contractIds),
      });
    }

    return this.templateEntityRepository.find({
      where,
      select: {
        id: true,
        title: true,
      },
      join: {
        alias: "template",
        leftJoinAndSelect: {
          contract: "template.contract",
        },
      },
    });
  }

  public findOne(
    where: FindOptionsWhere<TemplateEntity>,
    options?: FindOneOptions<TemplateEntity>,
  ): Promise<TemplateEntity | null> {
    return this.templateEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<TemplateEntity>): Promise<TemplateEntity | null> {
    const queryBuilder = this.templateEntityRepository.createQueryBuilder("template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");
    queryBuilder.leftJoinAndSelect("contract.merchant", "merchant");

    // get single token for ERC1155, to use in purchase
    queryBuilder.leftJoinAndSelect("template.tokens", "tokens", "contract.contractType = :tokenType", {
      tokenType: TokenType.ERC1155,
    });

    queryBuilder.leftJoinAndSelect("template.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");

    queryBuilder.leftJoinAndSelect(
      "price_template.tokens",
      "price_tokens",
      "price_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    );

    queryBuilder.andWhere("template.id = :id", {
      id: where.id,
    });

    return queryBuilder.getOne();
  }
}
