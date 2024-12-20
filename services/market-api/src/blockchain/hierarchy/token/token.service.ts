import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { ITokenAutocompleteDto, ITokenSearchDto } from "@framework/types";
import {
  ContractFeatures,
  ModuleType,
  TemplateStatus,
  TokenMetadata,
  TokenRarity,
  TokenStatus,
  TokenType,
} from "@framework/types";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { MysteryBoxEntity } from "../../mechanics/marketing/mystery/box/box.entity";
import { LotteryRoundEntity } from "../../mechanics/gambling/lottery/round/round.entity";
import { TokenEntity } from "./token.entity";

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    protected readonly tokenEntityRepository: Repository<TokenEntity>,
  ) {}

  public async search(
    dto: Partial<ITokenSearchDto>,
    userEntity: UserEntity,
    contractModule: Array<ModuleType>,
    contractType: Array<TokenType>,
    contractFeatures?: Array<ContractFeatures>,
  ): Promise<[Array<TokenEntity>, number]> {
    const {
      query,
      metadata = {},
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

    // MODULE:RENT
    queryBuilder.leftJoinAndSelect("rent.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");

    queryBuilder.leftJoinAndSelect(
      "price_template.tokens",
      "price_template_tokens",
      "price_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    );

    if (contractType.length === 1) {
      queryBuilder.andWhere("contract.contractType = :contractType", { contractType: contractType[0] });
    } else {
      queryBuilder.andWhere("contract.contractType IN(:...contractType)", {
        contractType,
      });
    }

    if (contractModule.length === 1) {
      queryBuilder.andWhere("contract.contractModule = :contractModule", { contractModule: contractModule[0] });
    } else {
      queryBuilder.andWhere(`contract.contractModule IN(:...contractModule)`, {
        contractModule,
      });
    }

    if (contractFeatures) {
      if (contractFeatures.length === 1) {
        queryBuilder.andWhere(":contractFeature = ANY(contract.contractFeatures)", {
          contractFeature: contractFeatures[0],
        });
      } else {
        queryBuilder.andWhere("contract.contractFeatures && :contractFeatures", { contractFeatures });
      }
    }

    queryBuilder.andWhere("contract.chainId = :chainId", {
      chainId: userEntity.chainId,
    });

    // TODO ERC20 tokens must be shown without balance?
    if (account && !contractType.includes(TokenType.ERC20)) {
      queryBuilder.andWhere("balance.account = :account", { account });
    }

    // SHOW TOKENS ONLY WITH ACTIVE TEMPLATE
    queryBuilder.andWhere("template.templateStatus = :templateStatus", { templateStatus: TemplateStatus.ACTIVE });

    const rarity = metadata[TokenMetadata.RARITY];
    if (rarity) {
      if (rarity.length === 1) {
        queryBuilder.andWhere(`token.metadata->>'${TokenMetadata.RARITY}' = :rarity`, {
          rarity: Object.values(TokenRarity).findIndex(r => r === rarity[0]),
        });
      } else {
        queryBuilder.andWhere(`token.metadata->>'${TokenMetadata.RARITY}' IN(:...rarity)`, {
          rarity: rarity.map(e => Object.values(TokenRarity).findIndex(r => r === e)),
        });
      }
    }

    const level = metadata[TokenMetadata.LEVEL];
    if (level) {
      if (level.length === 1) {
        queryBuilder.andWhere(`token.metadata->>'${TokenMetadata.LEVEL}' = :level`, {
          level: level[0],
        });
      } else {
        queryBuilder.andWhere(`token.metadata->>'${TokenMetadata.LEVEL}' IN(:...level)`, { level });
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
        "blocks",
        "TRUE",
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
      "token.id": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(dto: ITokenAutocompleteDto, userEntity: UserEntity): Promise<Array<TokenEntity>> {
    const { contractIds, templateIds, tokenStatus } = dto;
    const queryBuilder = this.tokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select(["token.id", "token.tokenId"]);

    queryBuilder.leftJoin("token.balance", "balance");
    queryBuilder.addSelect(["balance.account"]);

    queryBuilder.andWhere("balance.account = :account", { account: userEntity.wallet });

    queryBuilder.leftJoin("token.template", "template");
    queryBuilder.addSelect(["template.title", "template.id", "template.imageUrl"]);

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

    if (tokenStatus) {
      if (tokenStatus.length === 1) {
        queryBuilder.andWhere("token.tokenStatus = :tokenStatus", { tokenStatus: tokenStatus[0] });
      } else {
        queryBuilder.andWhere("token.tokenStatus IN(:...tokenStatus)", { tokenStatus });
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

  public findOneWithRelations(
    where: FindOptionsWhere<TokenEntity>,
    userEntity?: UserEntity,
  ): Promise<TokenEntity | null> {
    const queryBuilder = this.tokenEntityRepository.createQueryBuilder("token");

    queryBuilder.leftJoinAndSelect("token.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");
    queryBuilder.leftJoinAndSelect("contract.merchant", "merchant");

    queryBuilder.leftJoinAndSelect("template.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");

    // MODULE:LOTTERY
    // MODULE:RAFFLE
    queryBuilder.leftJoinAndMapOne(
      "token.round",
      LotteryRoundEntity,
      "round",
      `(token.metadata->>'${TokenMetadata.ROUND}')::numeric = round.id`,
    );
    queryBuilder.leftJoinAndSelect("round.price", "round_price");
    queryBuilder.leftJoinAndSelect("round_price.components", "round_price_components");
    queryBuilder.leftJoinAndSelect("round_price_components.contract", "round_price_contract");
    queryBuilder.leftJoinAndSelect("round_price_components.template", "round_price_template");

    // MODULE:MYSTERY
    queryBuilder.leftJoinAndMapOne("template.box", MysteryBoxEntity, "box", "box.templateId = template.id");
    queryBuilder.leftJoinAndSelect("box.content", "content");
    queryBuilder.leftJoinAndSelect("content.components", "content_components");
    queryBuilder.leftJoinAndSelect("content_components.template", "content_template");
    queryBuilder.leftJoinAndSelect("content_components.contract", "content_contract");

    // MODULE:RENT
    queryBuilder.leftJoinAndSelect("contract.rent", "rent");
    queryBuilder.leftJoinAndSelect("rent.price", "rent_price");
    queryBuilder.leftJoinAndSelect("rent_price.components", "rent_price_components");
    queryBuilder.leftJoinAndSelect("rent_price_components.contract", "rent_price_components_contract");
    queryBuilder.leftJoinAndSelect("rent_price_components.template", "rent_price_components_template");

    queryBuilder.leftJoinAndSelect(
      "rent_price_components_template.tokens",
      "rent_price_components_template_tokens",
      `rent_price_components_contract.contractType IN(:...tokenTypes)`,
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    );

    if (userEntity) {
      queryBuilder.leftJoinAndSelect(
        "token.balance",
        "balance",
        "contract.contract_module = :moduleType AND contract.contract_type = :tokenType AND balance.token_id = :tokenId AND balance.account = :account",
        {
          moduleType: ModuleType.HIERARCHY,
          tokenType: TokenType.ERC1155,
          tokenId: where.id,
          account: userEntity.wallet,
        },
      );
    }

    // MODULE:BREED
    // queryBuilder.leftJoinAndSelect("token.breeds", "breeds", "ANY(contract.contractFeatures) = :contractFeature", {
    //   contractFeature: ContractFeatures.GENES,
    // });
    // queryBuilder.leftJoinAndSelect(
    //   "breeds.children",
    //   "breed_childs",
    //   "ANY(contract.contractFeatures) = :contractFeature",
    //   {
    //     contractFeature: ContractFeatures.GENES,
    //   },
    // );
    // queryBuilder.leftJoinAndSelect(
    //   "breed_childs.history",
    //   "breed_history",
    //   "ANY(contract.contractFeatures) = :contractFeature",
    //   {
    //     contractFeature: ContractFeatures.GENES,
    //   },
    // );

    queryBuilder.andWhere("token.id = :id", {
      id: where.id,
    });

    return queryBuilder.getOne();
  }

  public findAll(
    where: FindOptionsWhere<TokenEntity>,
    options?: FindManyOptions<TokenEntity>,
  ): Promise<Array<TokenEntity>> {
    return this.tokenEntityRepository.find({ where, ...options });
  }
}
