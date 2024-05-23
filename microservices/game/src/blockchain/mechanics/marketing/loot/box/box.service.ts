import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { ILootBoxSearchDto } from "@framework/types";
import { ContractStatus, ModuleType, TemplateStatus, TokenType } from "@framework/types";

import { MerchantEntity } from "../../../../../infrastructure/merchant/merchant.entity";
import { LootBoxEntity } from "./box.entity";

@Injectable()
export class LootBoxService {
  constructor(
    @InjectRepository(LootBoxEntity)
    private readonly lootBoxEntityRepository: Repository<LootBoxEntity>,
  ) {}

  public async search(
    dto: Partial<ILootBoxSearchDto>,
    merchantEntity: MerchantEntity,
  ): Promise<[Array<LootBoxEntity>, number]> {
    const { query, contractIds, minPrice, maxPrice, chainId, skip, take } = dto;

    const queryBuilder = this.lootBoxEntityRepository.createQueryBuilder("box");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("box.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");
    queryBuilder.leftJoinAndSelect("contract.merchant", "merchant");

    queryBuilder.leftJoinAndSelect("box.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");

    queryBuilder.leftJoinAndSelect(
      "item_template.tokens",
      "item_tokens",
      "item_contract.contractType IN(:...tokenTypes)",
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

    queryBuilder.andWhere("contract.merchantId = :merchantId", {
      merchantId: merchantEntity.id,
    });
    queryBuilder.andWhere("contract.contractType = :contractType", {
      contractType: TokenType.ERC721,
    });
    queryBuilder.andWhere("contract.contractModule = :contractModule", {
      contractModule: ModuleType.LOOT,
    });
    queryBuilder.andWhere("contract.contractStatus = :contractStatus", {
      contractStatus: ContractStatus.ACTIVE,
    });
    queryBuilder.andWhere("contract.chainId = :chainId", {
      chainId,
    });
    queryBuilder.andWhere("box.lootBoxStatus = :lootBoxStatus", {
      lootBoxStatus: TemplateStatus.ACTIVE,
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
    where: FindOptionsWhere<LootBoxEntity>,
    options?: FindOneOptions<LootBoxEntity>,
  ): Promise<LootBoxEntity | null> {
    return this.lootBoxEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<LootBoxEntity>): Promise<LootBoxEntity | null> {
    const queryBuilder = this.lootBoxEntityRepository.createQueryBuilder("box");
    queryBuilder.leftJoinAndSelect("box.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");
    queryBuilder.leftJoinAndSelect("contract.merchant", "merchant");

    queryBuilder.leftJoinAndSelect("box.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect(
      "item_template.tokens",
      "item_tokens",
      "item_contract.contractType IN(:...tokenTypes)",
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

    return queryBuilder.getOne();
  }

  public async findOneWithRelationsOrFail(
    where: FindOptionsWhere<LootBoxEntity>,
    merchantEntity: MerchantEntity,
  ): Promise<LootBoxEntity> {
    const lootBoxEntity = await this.findOneWithRelations(where);

    if (!lootBoxEntity) {
      throw new NotFoundException("lootBoxNotFound");
    }

    if (lootBoxEntity.template.contract.merchantId !== merchantEntity.id) {
      throw new ForbiddenException("insufficientPermissions");
    }

    return lootBoxEntity;
  }

  public async autocomplete(merchantEntity: MerchantEntity): Promise<Array<LootBoxEntity>> {
    return this.lootBoxEntityRepository.find({
      where: {
        template: {
          contract: {
            merchantId: merchantEntity.id,
          },
        },
      },
      select: {
        id: true,
        title: true,
      },
    });
  }
}
