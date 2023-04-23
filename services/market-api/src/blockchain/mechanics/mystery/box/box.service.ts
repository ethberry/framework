import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, In, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { MysteryBoxEntity } from "./box.entity";
import type { IMysteryBoxSearchDto } from "@framework/types";
import { ContractStatus, ModuleType, TemplateStatus, TokenType } from "@framework/types";

@Injectable()
export class MysteryBoxService {
  constructor(
    @InjectRepository(MysteryBoxEntity)
    private readonly mysteryBoxEntityRepository: Repository<MysteryBoxEntity>,
  ) {}

  public async search(dto: Partial<IMysteryBoxSearchDto>, chainId: number): Promise<[Array<MysteryBoxEntity>, number]> {
    const { query, skip, take, contractIds, minPrice, maxPrice } = dto;

    const queryBuilder = this.mysteryBoxEntityRepository.createQueryBuilder("box");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("box.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");

    queryBuilder.leftJoinAndSelect("box.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");

    queryBuilder.leftJoinAndSelect("template.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");
    // we need to get single token for Native, erc20 and erc1155
    const tokenTypes = `'${TokenType.NATIVE}','${TokenType.ERC20}','${TokenType.ERC1155}'`;
    queryBuilder.leftJoinAndSelect(
      "price_template.tokens",
      "price_tokens",
      `price_contract.contractType IN(${tokenTypes})`,
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
      chainId,
    });

    queryBuilder.andWhere("box.mysteryboxStatus = :mysteryboxStatus", {
      mysteryboxStatus: TemplateStatus.ACTIVE,
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
        `blocks`,
        `TRUE`,
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

    queryBuilder.leftJoinAndSelect("box.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");

    queryBuilder.leftJoinAndSelect("template.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");
    // we need to get single token for Native, erc20 and erc1155
    const tokenTypes = `'${TokenType.NATIVE}','${TokenType.ERC20}','${TokenType.ERC1155}'`;
    queryBuilder.leftJoinAndSelect(
      "price_template.tokens",
      "price_tokens",
      `price_contract.contractType IN(${tokenTypes})`,
    );
    queryBuilder.andWhere("box.id = :id", {
      id: where.id,
    });

    return queryBuilder.getOne();
    // return this.findOne(where, {
    //   join: {
    //     alias: "box",
    //     leftJoinAndSelect: {
    //       template: "box.template",
    //       contract: "template.contract",
    //       item: "box.item",
    //       item_components: "item.components",
    //       item_contract: "item_components.contract",
    //       item_template: "item_components.template",
    //       price: "template.price",
    //       price_components: "price.components",
    //       price_contract: "price_components.contract",
    //       price_template: "price_components.template",
    //       price_tokens: "price_template.tokens",
    //     },
    //   },
    //   order: { createdAt: "DESC" },
    // });
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
