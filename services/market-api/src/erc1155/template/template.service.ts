import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IErc1155TemplateSearchDto } from "@framework/types";
import { TemplateEntity } from "../../blockchain/hierarchy/template/template.entity";

@Injectable()
export class Erc1155TemplateService {
  constructor(
    @InjectRepository(TemplateEntity)
    private readonly erc1155TokenEntityRepository: Repository<TemplateEntity>,
  ) {}

  public async search(dto: IErc1155TemplateSearchDto): Promise<[Array<TemplateEntity>, number]> {
    const { query, skip, take, contractIds, minPrice, maxPrice } = dto;

    const queryBuilder = this.erc1155TokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();
    queryBuilder.leftJoinAndSelect("token.erc1155Collection", "collection");
    queryBuilder.leftJoinAndSelect("token.erc20Token", "erc20_token");

    // search only ACTIVE collections
    queryBuilder.andWhere("contract.contractStatus = 'ACTIVE'");

    if (contractIds) {
      if (contractIds.length === 1) {
        queryBuilder.andWhere("token.contractId = :contractId", {
          contractId: contractIds[0],
        });
      } else {
        queryBuilder.andWhere("token.contractId IN(:...contractIds)", { contractIds });
      }
    }

    if (query) {
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(token.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("token.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    if (maxPrice) {
      queryBuilder.andWhere("token.price <= :maxPrice", { maxPrice });
    }

    if (minPrice) {
      queryBuilder.andWhere("token.price >= :minPrice", { minPrice });
    }

    queryBuilder.andWhere(
      new Brackets(qb => {
        qb.where("token.amount = 0");
        qb.orWhere("token.amount > token.instanceCount");
      }),
    );

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "token.tokenId": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<TemplateEntity>,
    options?: FindOneOptions<TemplateEntity>,
  ): Promise<TemplateEntity | null> {
    return this.erc1155TokenEntityRepository.findOne({ where, ...options });
  }
}
