import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { MysteryboxBoxEntity } from "./box.entity";
import { ContractStatus, ModuleType, TemplateStatus, TokenType } from "@framework/types";
import type { IMysteryboxSearchDto } from "@framework/types";

@Injectable()
export class MysteryboxBoxService {
  constructor(
    @InjectRepository(MysteryboxBoxEntity)
    private readonly mysteryboxEntityRepository: Repository<MysteryboxBoxEntity>,
  ) {}

  public async search(
    dto: Partial<IMysteryboxSearchDto>,
    chainId: number,
  ): Promise<[Array<MysteryboxBoxEntity>, number]> {
    const { query, skip, take, contractIds, minPrice, maxPrice } = dto;

    const queryBuilder = this.mysteryboxEntityRepository.createQueryBuilder("mysterybox");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("mysterybox.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");

    queryBuilder.leftJoinAndSelect("mysterybox.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");

    queryBuilder.leftJoinAndSelect("template.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");
    queryBuilder.leftJoinAndSelect("price_template.tokens", "price_tokens");

    queryBuilder.andWhere("contract.contractType = :contractType", {
      contractType: TokenType.ERC721,
    });
    queryBuilder.andWhere("contract.contractModule = :contractModule", {
      contractModule: ModuleType.MYSTERYBOX,
    });

    queryBuilder.andWhere("contract.contractStatus = :contractStatus", {
      contractStatus: ContractStatus.ACTIVE,
    });
    queryBuilder.andWhere("contract.chainId = :chainId", {
      chainId,
    });

    queryBuilder.andWhere("mysterybox.mysteryboxStatus = :mysteryboxStatus", {
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

    if (maxPrice) {
      queryBuilder.andWhere("price_components.amount <= :maxPrice", { maxPrice });
    }

    if (minPrice) {
      queryBuilder.andWhere("price_components.amount >= :minPrice", { minPrice });
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
      "mysterybox.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<MysteryboxBoxEntity>,
    options?: FindOneOptions<MysteryboxBoxEntity>,
  ): Promise<MysteryboxBoxEntity | null> {
    return this.mysteryboxEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<MysteryboxBoxEntity>): Promise<MysteryboxBoxEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "mysterybox",
        leftJoinAndSelect: {
          template: "mysterybox.template",
          contract: "template.contract",
          item: "mysterybox.item",
          item_components: "item.components",
          item_contract: "item_components.contract",
          item_template: "item_components.template",
          price: "template.price",
          price_components: "price.components",
          price_contract: "price_components.contract",
          price_template: "price_components.template",
          price_tokens: "price_template.tokens",
        },
      },
    });
  }

  public async autocomplete(): Promise<Array<MysteryboxBoxEntity>> {
    return this.mysteryboxEntityRepository.find({
      select: {
        id: true,
        title: true,
      },
    });
  }
}
