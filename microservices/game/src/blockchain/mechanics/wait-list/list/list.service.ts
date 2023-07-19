import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { ISearchDto } from "@gemunion/types-collection";

import { MerchantEntity } from "../../../../infrastructure/merchant/merchant.entity";
import { WaitListListEntity } from "./list.entity";

@Injectable()
export class WaitListListService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @InjectRepository(WaitListListEntity)
    private readonly waitListListEntityRepository: Repository<WaitListListEntity>,
  ) {}

  public async search(
    dto: Partial<ISearchDto>,
    merchantEntity: MerchantEntity,
  ): Promise<[Array<WaitListListEntity>, number]> {
    const { query, skip, take } = dto;

    const queryBuilder = this.waitListListEntityRepository.createQueryBuilder("waitlist");

    queryBuilder.select();

    queryBuilder.leftJoin("waitlist.contract", "contract");
    queryBuilder.addSelect(["contract.contractStatus"]);

    queryBuilder.andWhere("contract.merchantId = :merchantId", {
      merchantId: merchantEntity.id,
    });

    if (query) {
      queryBuilder.leftJoin(
        qb => {
          qb.getQuery = () => `LATERAL json_array_elements(waitlist.description->'blocks')`;
          return qb;
        },
        `blocks`,
        `TRUE`,
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("waitlist.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "waitlist.createdAt": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<WaitListListEntity>,
    options?: FindOneOptions<WaitListListEntity>,
  ): Promise<WaitListListEntity | null> {
    return this.waitListListEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<WaitListListEntity>): Promise<WaitListListEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "waitlist",
        leftJoinAndSelect: {
          contract: "waitlist.contract",
          items: "waitlist.items",
          item: "waitlist.item",
          item_components: "item.components",
          item_template: "item_components.template",
          item_contract: "item_components.contract",
        },
      },
    });
  }
}
