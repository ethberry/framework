import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";
import { parse } from "json2csv";

import { IMarketplaceReportSearchDto } from "@framework/types";

import { TokenEntity } from "../../hierarchy/token/token.entity";
import { formatPrice } from "./marketplace.utils";

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectRepository(TokenEntity)
    protected readonly tokenEntityRepository: Repository<TokenEntity>,
  ) {}

  public async search(dto: Partial<IMarketplaceReportSearchDto>): Promise<[Array<TokenEntity>, number]> {
    const { query, contractIds, templateIds, startTimestamp, endTimestamp, skip, take } = dto;

    const queryBuilder = this.tokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("token.template", "template");

    // TODO use actual price
    queryBuilder.leftJoinAndSelect("template.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");

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

    if (startTimestamp && endTimestamp) {
      queryBuilder.andWhere("token.createdAt >= :startTimestamp AND token.createdAt < :endTimestamp", {
        startTimestamp,
        endTimestamp,
      });
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

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "token.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async export(dto: IMarketplaceReportSearchDto): Promise<string> {
    const { skip: _skip, take: _take, ...rest } = dto;

    const [list] = await this.search(rest);

    const headers = ["id", "title", "createdAt", "price"];

    return parse(
      list.map(tokenEntity => ({
        id: tokenEntity.id,
        title: tokenEntity.template.title,
        createdAt: tokenEntity.createdAt,
        price: formatPrice(tokenEntity.template.price),
      })),
      { fields: headers },
    );
  }
}
