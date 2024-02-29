import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IMergeSearchDto } from "@framework/types";

import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { MergeEntity } from "./merge.entity";

@Injectable()
export class MergeService {
  constructor(
    @InjectRepository(MergeEntity)
    private readonly mergeEntityRepository: Repository<MergeEntity>,
  ) {}

  public search(dto: Partial<IMergeSearchDto>, userEntity: UserEntity): Promise<[Array<MergeEntity>, number]> {
    const { query, mergeStatus, skip, take } = dto;

    const queryBuilder = this.mergeEntityRepository.createQueryBuilder("merge");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("merge.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");

    queryBuilder.leftJoinAndSelect("merge.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");

    queryBuilder.andWhere("merge.merchantId = :merchantId", {
      merchantId: userEntity.merchantId,
    });

    if (query) {
      queryBuilder.leftJoin(
        qb => {
          qb.getQuery = () => `LATERAL json_array_elements(price_template.description->'blocks')`;
          return qb;
        },
        `blocks`,
        `TRUE`,
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("price_template.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    if (mergeStatus) {
      if (mergeStatus.length === 1) {
        queryBuilder.andWhere("merge.mergeStatus = :mergeStatus", { mergeStatus: mergeStatus[0] });
      } else {
        queryBuilder.andWhere("merge.mergeStatus IN(:...mergeStatus)", { mergeStatus });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<MergeEntity>,
    options?: FindOneOptions<MergeEntity>,
  ): Promise<MergeEntity | null> {
    return this.mergeEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<MergeEntity>): Promise<MergeEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "merge",
        leftJoinAndSelect: {
          item: "merge.item",
          item_components: "item.components",
          item_template: "item_components.template",
          item_contract: "item_components.contract",
          price: "merge.price",
          price_components: "price.components",
          price_template: "price_components.template",
          price_contract: "price_components.contract",
        },
      },
    });
  }
}
