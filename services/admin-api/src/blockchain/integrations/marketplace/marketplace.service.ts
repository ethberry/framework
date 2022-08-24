import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { Brackets, EntityManager, Repository } from "typeorm";
import { parse } from "json2csv";

import { IMarketplaceReportSearchDto, TokenType } from "@framework/types";

import { TokenEntity } from "../../hierarchy/token/token.entity";
import { formatPrice } from "./marketplace.utils";
import { ns } from "@framework/constants";

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectRepository(TokenEntity)
    protected readonly tokenEntityRepository: Repository<TokenEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async search(dto: Partial<IMarketplaceReportSearchDto>): Promise<[Array<TokenEntity>, number]> {
    const { query, contractIds, templateIds, startTimestamp, endTimestamp, skip, take } = dto;

    const queryBuilder = this.tokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("token.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");

    // TODO use actual price
    queryBuilder.leftJoinAndSelect("template.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");

    queryBuilder.andWhere("contract.contractType IN(:...contractType)", {
      contractType: [TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155],
    });

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

  public async chart(dto: IMarketplaceReportSearchDto): Promise<any> {
    const { templateIds = [], contractIds = [], startTimestamp, endTimestamp } = dto;

    const queryString = `
        SELECT 
            COUNT(token.id)::INTEGER AS count,
            date_trunc('day', token.created_at) as date
        FROM
            ${ns}.token
        LEFT JOIN
            ${ns}.template ON template.id = token.template_id
        WHERE
            (token.template_id = ANY ($1) OR cardinality($1) = 0)
            AND
            (template.contract_id = ANY ($2) OR cardinality($2) = 0)
            AND
            (token.created_at >= $3 AND token.created_at < $4)
        GROUP BY
            date
        ORDER BY
            date
    `;

    return Promise.all([
      this.entityManager.query(queryString, [templateIds, contractIds, startTimestamp, endTimestamp]),
      0,
    ]);
  }
}
