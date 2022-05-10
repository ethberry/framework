import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IErc1155TokenSearchDto } from "@framework/types";

import { Erc1155TokenEntity } from "./token.entity";

@Injectable()
export class Erc1155TokenService {
  constructor(
    @InjectRepository(Erc1155TokenEntity)
    private readonly erc1155TokenEntityRepository: Repository<Erc1155TokenEntity>,
  ) {}

  public async search(dto: IErc1155TokenSearchDto): Promise<[Array<Erc1155TokenEntity>, number]> {
    const { query, skip, take, tokenId, erc1155CollectionIds, minPrice, maxPrice } = dto;

    const queryBuilder = this.erc1155TokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();
    queryBuilder.leftJoinAndSelect("token.erc1155Collection", "collection");

    if (tokenId) {
      queryBuilder.andWhere("token.tokenId = :tokenId", { tokenId });
    }

    if (erc1155CollectionIds) {
      if (erc1155CollectionIds.length === 1) {
        queryBuilder.andWhere("token.erc1155CollectionId = :erc1155CollectionId", {
          erc1155CollectionId: erc1155CollectionIds[0],
        });
      } else {
        queryBuilder.andWhere("token.erc1155CollectionId IN(:...erc1155CollectionIds)", { erc1155CollectionIds });
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
        qb.orWhere("token.amount < token.instanceCount");
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
    where: FindOptionsWhere<Erc1155TokenEntity>,
    options?: FindOneOptions<Erc1155TokenEntity>,
  ): Promise<Erc1155TokenEntity | null> {
    return this.erc1155TokenEntityRepository.findOne({ where, ...options });
  }

  public async getNewTokens(): Promise<[Array<Erc1155TokenEntity>, number]> {
    const queryBuilder = this.erc1155TokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("token.erc1155Collection", "collection");

    queryBuilder.orderBy({
      "token.createdAt": "DESC",
    });

    queryBuilder.skip(0);
    queryBuilder.take(10);

    return queryBuilder.getManyAndCount();
  }
}
