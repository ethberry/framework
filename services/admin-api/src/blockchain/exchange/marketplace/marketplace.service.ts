import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { Brackets, EntityManager, Repository } from "typeorm";
import { parse } from "json2csv";

import { ns } from "@framework/constants";
import type { IMarketplaceReportSearchDto, IMarketplaceSupplySearchDto } from "@framework/types";
import { ContractEventType, ExchangeType, TokenType, UserRole } from "@framework/types";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { EventHistoryEntity } from "../../event-history/event-history.entity";
import { ContractEntity } from "../../hierarchy/contract/contract.entity";
import { AssetComponentHistoryEntity } from "../asset/asset-component-history.entity";
import { formatPrice } from "./marketplace.utils";

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectRepository(EventHistoryEntity)
    protected readonly eventHistoryEntityRepository: Repository<EventHistoryEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async search(
    dto: Partial<IMarketplaceReportSearchDto>,
    userEntity: UserEntity,
  ): Promise<[Array<EventHistoryEntity>, number]> {
    const { query, contractIds, templateIds, startTimestamp, endTimestamp, skip, take } = dto;

    if (!userEntity.userRoles.includes(UserRole.ADMIN)) {
      throw new ForbiddenException("insufficientPermissions");
    }

    const queryBuilder = this.eventHistoryEntityRepository.createQueryBuilder("history");

    queryBuilder.select();

    queryBuilder.leftJoinAndMapMany(
      "history.items",
      AssetComponentHistoryEntity,
      "item",
      "history.id = item.historyId AND item.exchangeType = :exchangeType1",
      {
        exchangeType1: ExchangeType.ITEM,
      },
    );
    queryBuilder.leftJoinAndSelect("item.token", "item_token");
    queryBuilder.leftJoinAndSelect("item_token.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_template.contract", "item_template_contract");
    queryBuilder.leftJoinAndSelect("item.contract", "item_contract");

    queryBuilder.leftJoinAndMapMany(
      "history.price",
      AssetComponentHistoryEntity,
      "price",
      "history.id = price.historyId AND price.exchangeType = :exchangeType2",
      {
        exchangeType2: ExchangeType.PRICE,
      },
    );
    queryBuilder.leftJoinAndSelect("price.token", "price_token");
    queryBuilder.leftJoinAndSelect("price_token.template", "price_template");
    queryBuilder.leftJoinAndSelect("price_template.contract", "price_template_contract");
    queryBuilder.leftJoinAndSelect("price.contract", "price_contract");

    queryBuilder.innerJoinAndMapOne(
      "history.contract",
      ContractEntity,
      "contract",
      "history.address = contract.address",
    );
    queryBuilder.andWhere("contract.chainId = :chainId", {
      chainId: userEntity.chainId,
    });

    queryBuilder.andWhere("history.event_type = :eventType", { eventType: ContractEventType.Purchase });

    queryBuilder.andWhere("item_contract.contractType IN(:...contractType)", {
      contractType: [TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155],
    });

    if (templateIds) {
      if (templateIds.length === 1) {
        queryBuilder.andWhere("item_token.templateId = :templateId", {
          templateId: templateIds[0],
        });
      } else {
        queryBuilder.andWhere("item_token.templateId IN(:...templateIds)", { templateIds });
      }
    }

    if (contractIds) {
      if (contractIds.length === 1) {
        queryBuilder.andWhere("item_template.contractId = :contractId", {
          contractId: contractIds[0],
        });
      } else {
        queryBuilder.andWhere("item_template.contractId IN(:...contractIds)", { contractIds });
      }
    }

    if (startTimestamp && endTimestamp) {
      queryBuilder.andWhere("history.createdAt >= :startTimestamp AND history.createdAt < :endTimestamp", {
        startTimestamp,
        endTimestamp,
      });
    }

    if (query) {
      queryBuilder.leftJoin(
        qb => {
          qb.getQuery = () => `LATERAL json_array_elements(item_template.description->'blocks')`;
          return qb;
        },
        `blocks`,
        `TRUE`,
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("item_template.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "history.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async export(dto: Partial<IMarketplaceReportSearchDto>, userEntity: UserEntity): Promise<string> {
    const { skip: _skip, take: _take, ...rest } = dto;

    const [list] = await this.search(rest, userEntity);

    const headers = ["id", "title", "createdAt", "price"];

    return parse(
      list.map(eventHistoryEntity => ({
        id: eventHistoryEntity.id,
        // @ts-ignore
        title: eventHistoryEntity.item.template.title,
        createdAt: eventHistoryEntity.createdAt,
        // @ts-ignore
        price: formatPrice(eventHistoryEntity.item.template.price),
      })),
      { fields: headers },
    );
  }

  public async supply(dto: Partial<IMarketplaceSupplySearchDto>, userEntity: UserEntity): Promise<any> {
    const { attribute, tokenType, tokenStatus, templateIds = [], contractIds = [] } = dto;

    if (!userEntity.userRoles.includes(UserRole.ADMIN)) {
      throw new ForbiddenException("insufficientPermissions");
    }

    // prettier-ignore
    const queryString = `
        SELECT
            COUNT(token.id)::INTEGER AS count,
            (token.metadata->>$1)::INTEGER as attribute
        FROM
            ${ns}.token
          LEFT JOIN
            ${ns}.template ON template.id = token.template_id
          LEFT JOIN
            ${ns}.contract ON contract.id = template.contract_id
        WHERE
            (token.metadata->>$1) is not null
          AND
            contract.contract_type = $2
          AND
            token.token_status = $3
          AND
            (token.template_id = ANY($4) OR cardinality($4) = 0)
          AND
            (template.contract_id = ANY($5) OR cardinality($5) = 0)
          AND
            contract.chain_id = $6
        GROUP BY
            attribute
        ORDER BY
            attribute
          DESC
    `;

    return Promise.all([
      this.entityManager.query(queryString, [
        attribute,
        tokenType,
        tokenStatus,
        templateIds,
        contractIds,
        userEntity.chainId,
      ]),
      0,
    ]);
  }

  public async chart(dto: Partial<IMarketplaceReportSearchDto>, userEntity: UserEntity): Promise<any> {
    const { templateIds = [], contractIds = [], startTimestamp, endTimestamp } = dto;

    if (!userEntity.userRoles.includes(UserRole.ADMIN)) {
      throw new ForbiddenException("insufficientPermissions");
    }

    // prettier-ignore
    const queryString = `
        SELECT
             SUM(c2.amount) as sum,
             COUNT(item_token.id)::INTEGER AS count,
             date_trunc('day', event_history.created_at) as date
        FROM
            ${ns}.token as item_token
          INNER JOIN
            ${ns}.asset_component_history c1 ON c1.token_id = item_token.id AND c1.exchange_type = 'ITEM'
          INNER JOIN
            ${ns}.event_history ON event_history.id = c1.history_id AND event_history.event_type = 'Purchase'
          INNER JOIN
            ${ns}.asset_component_history c2 ON c2.history_id = event_history.id AND c2.exchange_type = 'PRICE'
          INNER JOIN
            ${ns}.token price_token ON c2.token_id = price_token.id
          LEFT JOIN
            ${ns}.template as item_template ON item_template.id = item_token.template_id
          LEFT JOIN
            ${ns}.contract as item_contract ON item_contract.id = item_template.contract_id
          LEFT JOIN
            ${ns}.template as price_template ON price_template.id = price_token.template_id
          LEFT JOIN
            ${ns}.contract as price_contract ON price_contract.id = price_template.contract_id
          WHERE
              (item_token.template_id = ANY($1) OR cardinality($1) = 0)
            AND
              (item_template.contract_id = ANY($2) OR cardinality($2) = 0)
            AND
              (event_history.created_at >= $3 AND event_history.created_at < $4)
            AND
              item_contract.chain_id = $5
          GROUP BY
              date
          ORDER BY date
    `;

    return Promise.all([
      this.entityManager.query(queryString, [
        templateIds,
        contractIds,
        startTimestamp,
        endTimestamp,
        userEntity.chainId,
      ]),
      0,
    ]);
  }
}
