import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IErc721TokenSearchDto } from "@framework/types";

import { Erc721TokenEntity } from "./token.entity";
import { IErc721TokenUpdateDto } from "./interfaces";

@Injectable()
export class Erc721TokenService {
  constructor(
    @InjectRepository(Erc721TokenEntity)
    private readonly erc721TokenEntityRepository: Repository<Erc721TokenEntity>,
  ) {}

  public async search(dto: IErc721TokenSearchDto): Promise<[Array<Erc721TokenEntity>, number]> {
    const { query, tokenStatus, skip, take, tokenId, rarity, erc721CollectionIds } = dto;

    const queryBuilder = this.erc721TokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("token.erc721Template", "template");

    if (tokenId) {
      queryBuilder.andWhere("token.tokenId = :tokenId", { tokenId });
    }

    if (rarity) {
      if (rarity.length === 1) {
        queryBuilder.andWhere("token.attributes->>'rarity' = :rarity", { rarity: rarity[0] });
      } else {
        queryBuilder.andWhere("token.attributes->>'rarity' IN(:...rarity)", { rarity });
      }
    }

    if (tokenStatus) {
      if (tokenStatus.length === 1) {
        queryBuilder.andWhere("token.tokenStatus = :tokenStatus", { tokenStatus: tokenStatus[0] });
      } else {
        queryBuilder.andWhere("token.tokenStatus IN(:...tokenStatus)", { tokenStatus });
      }
    }

    if (erc721CollectionIds) {
      if (erc721CollectionIds.length === 1) {
        queryBuilder.andWhere("template.erc721CollectionId = :erc721CollectionId", {
          erc721CollectionId: erc721CollectionIds[0],
        });
      } else {
        queryBuilder.andWhere("template.erc721CollectionId IN(:...erc721CollectionIds)", { erc721CollectionIds });
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

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "token.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(): Promise<Array<Erc721TokenEntity>> {
    const queryBuilder = this.erc721TokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select(["id", "tokenId"]);
    queryBuilder.leftJoin("token.template", "template");
    queryBuilder.addSelect(["template.title"]);

    queryBuilder.orderBy({
      "token.createdAt": "DESC",
    });

    return queryBuilder.getMany();
  }

  public findOne(
    where: FindOptionsWhere<Erc721TokenEntity>,
    options?: FindOneOptions<Erc721TokenEntity>,
  ): Promise<Erc721TokenEntity | null> {
    return this.erc721TokenEntityRepository.findOne({ where, ...options });
  }

  public async update(
    where: FindOptionsWhere<Erc721TokenEntity>,
    dto: IErc721TokenUpdateDto,
  ): Promise<Erc721TokenEntity> {
    const tokenEntity = await this.findOne(where);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    Object.assign(tokenEntity, dto);

    return tokenEntity.save();
  }
}
