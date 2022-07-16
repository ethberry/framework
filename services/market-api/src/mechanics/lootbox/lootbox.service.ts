import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ILootboxSearchDto } from "@framework/types";

import { LootboxEntity } from "./lootbox.entity";
import { TemplateEntity } from "../../blockchain/hierarchy/template/template.entity";

@Injectable()
export class LootboxService {
  constructor(
    @InjectRepository(LootboxEntity)
    private readonly lootboxEntityRepository: Repository<LootboxEntity>,
  ) {}

  public async search(dto: ILootboxSearchDto): Promise<[Array<LootboxEntity>, number]> {
    const { query, lootboxStatus, skip, take, contractIds } = dto;

    const queryBuilder = this.lootboxEntityRepository.createQueryBuilder("lootbox");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("lootbox.contract", "contract");

    queryBuilder.leftJoinAndSelect("lootbox.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    queryBuilder.leftJoinAndSelect("price_components.token", "price_token");

    queryBuilder.leftJoinAndSelect("lootbox.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");
    queryBuilder.leftJoinAndSelect("item_components.token", "item_token");
    queryBuilder.leftJoinAndSelect("item_token.template", "item_template");

    if (contractIds) {
      if (contractIds.length === 1) {
        queryBuilder.andWhere("item_contract.id = :contractId", {
          contractId: contractIds[0],
        });
      } else {
        queryBuilder.andWhere("item_contract.id IN(:...contractIds)", { contractIds });
      }
    }

    if (lootboxStatus) {
      if (lootboxStatus.length === 1) {
        queryBuilder.andWhere("lootbox.lootboxStatus = :lootboxStatus", { lootboxStatus: lootboxStatus[0] });
      } else {
        queryBuilder.andWhere("lootbox.lootboxStatus IN(:...lootboxStatus)", { lootboxStatus });
      }
    }

    // TODO restore
    // if (maxPrice) {
    //   queryBuilder.andWhere("lootbox.price <= :maxPrice", { maxPrice });
    // }
    //
    // if (minPrice) {
    //   queryBuilder.andWhere("lootbox.price >= :minPrice", { minPrice });
    // }

    if (query) {
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(lootbox.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("lootbox.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    // if (templateContractIds) {
    //   if (templateContractIds.length === 1) {
    //     queryBuilder.andWhere("template.contractId = :contractId", {
    //       templateContractId: templateContractIds[0],
    //     });
    //   } else {
    //     queryBuilder.andWhere("template.contractId IN(:...templateContractIds)", {
    //       templateContractIds,
    //     });
    //   }
    // }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "lootbox.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<LootboxEntity>,
    options?: FindOneOptions<LootboxEntity>,
  ): Promise<LootboxEntity | null> {
    return this.lootboxEntityRepository.findOne({ where, ...options });
  }

  public findOneWithPrice(where: FindOptionsWhere<TemplateEntity>): Promise<LootboxEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "lootbox",
        leftJoinAndSelect: {
          contract: "lootbox.contract",
          price: "lootbox.price",
          price_components: "price.components",
          price_contract: "price_components.contract",
          price_token: "price_components.token",
        },
      },
    });
  }
}
