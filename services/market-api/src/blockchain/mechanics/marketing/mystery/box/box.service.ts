import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { defaultChainId } from "@framework/constants";
import type { IMysteryBoxSearchDto } from "@framework/types";
import { ContractStatus, ModuleType, MysteryBoxStatus, TemplateStatus, TokenType } from "@framework/types";

import { MysteryBoxEntity } from "./box.entity";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";

@Injectable()
export class MysteryBoxService {
  constructor(
    @InjectRepository(MysteryBoxEntity)
    private readonly mysteryBoxEntityRepository: Repository<MysteryBoxEntity>,
  ) {}

  public async search(
    dto: Partial<IMysteryBoxSearchDto>,
    userEntity?: UserEntity,
  ): Promise<[Array<MysteryBoxEntity>, number]> {
    const { query, skip, take, contractIds, minPrice, maxPrice } = dto;

    const queryBuilder = this.mysteryBoxEntityRepository.createQueryBuilder("box");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("box.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");
    queryBuilder.leftJoinAndSelect("contract.merchant", "merchant");

    queryBuilder.leftJoinAndSelect("box.content", "content");
    queryBuilder.leftJoinAndSelect("content.components", "content_components");
    queryBuilder.leftJoinAndSelect("content_components.template", "content_template");
    queryBuilder.leftJoinAndSelect("content_components.contract", "content_contract");

    queryBuilder.leftJoinAndSelect(
      "content_template.tokens",
      "content_tokens",
      "content_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    );

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

    queryBuilder.andWhere("contract.contractType = :contractType", {
      contractType: TokenType.ERC721,
    });
    queryBuilder.andWhere("contract.contractModule = :contractModule", {
      contractModule: ModuleType.MYSTERY,
    });

    queryBuilder.andWhere("contract.contractStatus = :contractStatus", {
      contractStatus: ContractStatus.ACTIVE,
    });
    queryBuilder.andWhere("contract.chainId = :chainId", {
      chainId: userEntity?.chainId || Number(defaultChainId),
    });

    queryBuilder.andWhere("box.mysteryBoxStatus = :mysteryBoxStatus", {
      mysteryBoxStatus: MysteryBoxStatus.ACTIVE,
    });

    // content or price template must be active
    queryBuilder.andWhere("content_template.templateStatus = :templateStatus", {
      templateStatus: TemplateStatus.ACTIVE,
    });
    queryBuilder.andWhere("price_template.templateStatus = :templateStatus", { templateStatus: TemplateStatus.ACTIVE });

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
          qb.getQuery = () => `LATERAL json_array_elements(box.description->'blocks')`;
          return qb;
        },
        "blocks",
        "TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("box.title ILIKE '%' || :title || '%'", { title: query });
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
      "box.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<MysteryBoxEntity>,
    options?: FindOneOptions<MysteryBoxEntity>,
  ): Promise<MysteryBoxEntity | null> {
    return this.mysteryBoxEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<MysteryBoxEntity>): Promise<MysteryBoxEntity | null> {
    const queryBuilder = this.mysteryBoxEntityRepository.createQueryBuilder("box");
    queryBuilder.leftJoinAndSelect("box.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");
    queryBuilder.leftJoinAndSelect("contract.merchant", "merchant");

    queryBuilder.leftJoinAndSelect("box.content", "content");
    queryBuilder.leftJoinAndSelect("content.components", "content_components");
    queryBuilder.leftJoinAndSelect("content_components.contract", "content_contract");
    queryBuilder.leftJoinAndSelect("content_components.template", "content_template");
    queryBuilder.leftJoinAndSelect(
      "content_template.tokens",
      "content_tokens",
      "content_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    );

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
    queryBuilder.andWhere("box.id = :id", {
      id: where.id,
    });

    // content or price template must be active
    queryBuilder.andWhere("content_template.templateStatus = :templateStatus", {
      templateStatus: TemplateStatus.ACTIVE,
    });
    queryBuilder.andWhere("price_template.templateStatus = :templateStatus", { templateStatus: TemplateStatus.ACTIVE });

    return queryBuilder.getOne();
  }

  public async autocomplete(): Promise<Array<MysteryBoxEntity>> {
    return this.mysteryBoxEntityRepository.find({
      select: {
        id: true,
        title: true,
      },
    });
  }
}
