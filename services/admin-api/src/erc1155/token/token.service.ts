import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc1155TokenStatus, IErc1155TokenSearchDto } from "@framework/types";
import { ns } from "@framework/constants";

import { Erc1155TokenEntity } from "./token.entity";
import { IErc1155TokenCreateDto, IErc1155TokenUpdateDto } from "./interfaces";

@Injectable()
export class Erc1155TokenService {
  constructor(
    @InjectRepository(Erc1155TokenEntity)
    private readonly erc1155TokenEntityRepository: Repository<Erc1155TokenEntity>,
  ) {}

  public async search(dto: IErc1155TokenSearchDto): Promise<[Array<Erc1155TokenEntity>, number]> {
    const { query, skip, take, tokenId, erc1155CollectionIds, tokenStatus } = dto;

    const queryBuilder = this.erc1155TokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

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

    if (tokenStatus) {
      if (tokenStatus.length === 1) {
        queryBuilder.andWhere("token.tokenStatus = :tokenStatus", {
          tokenStatus: tokenStatus[0],
        });
      } else {
        queryBuilder.andWhere("token.tokenStatus IN(:...tokenStatus)", { tokenStatus });
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

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "token.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(): Promise<Array<Erc1155TokenEntity>> {
    return this.erc1155TokenEntityRepository.find({
      select: {
        id: true,
        title: true,
      },
    });
  }

  public findOne(
    where: FindOptionsWhere<Erc1155TokenEntity>,
    options?: FindOneOptions<Erc1155TokenEntity>,
  ): Promise<Erc1155TokenEntity | null> {
    return this.erc1155TokenEntityRepository.findOne({ where, ...options });
  }

  public async getMaxTokenIdForCollection(collectionId: number): Promise<number> {
    const queryString = `
      select
        coalesce(max(token_id::integer), 0) as "tokenId"
      from
        ${ns}.erc1155_token
      where
        erc1155_collection_id = $1
    `;

    const result: Array<{ tokenId: number }> = await this.erc1155TokenEntityRepository.query(queryString, [
      collectionId,
    ]);

    return result[0].tokenId;
  }

  public async create(dto: IErc1155TokenCreateDto): Promise<Erc1155TokenEntity> {
    const maxTokenId = await this.getMaxTokenIdForCollection(dto.erc1155CollectionId);

    return this.erc1155TokenEntityRepository
      .create({
        tokenId: (maxTokenId + 1).toString(),
        ...dto,
      })
      .save();
  }

  public async update(
    where: FindOptionsWhere<Erc1155TokenEntity>,
    dto: Partial<IErc1155TokenUpdateDto>,
  ): Promise<Erc1155TokenEntity> {
    const tokenEntity = await this.findOne(where);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    Object.assign(tokenEntity, dto);

    return tokenEntity.save();
  }

  public async delete(where: FindOptionsWhere<Erc1155TokenEntity>): Promise<Erc1155TokenEntity> {
    return this.update(where, { tokenStatus: Erc1155TokenStatus.INACTIVE });
  }
}
