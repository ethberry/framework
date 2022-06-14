import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IErc998TokenSearchDto } from "@framework/types";

import { Erc998TokenEntity } from "./token.entity";
import { IErc998TokenUpdateDto } from "./interfaces";

@Injectable()
export class Erc998TokenService {
  constructor(
    @InjectRepository(Erc998TokenEntity)
    private readonly erc998TokenEntityRepository: Repository<Erc998TokenEntity>,
  ) {}

  public async search(dto: IErc998TokenSearchDto): Promise<[Array<Erc998TokenEntity>, number]> {
    const { query, tokenStatus, skip, take, tokenId, rarity, erc998CollectionIds } = dto;

    const queryBuilder = this.erc998TokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("token.erc998Template", "template");

    if (tokenId) {
      queryBuilder.andWhere("token.tokenId = :tokenId", { tokenId });
    }

    if (rarity) {
      if (rarity.length === 1) {
        queryBuilder.andWhere("token.rarity = :rarity", { rarity: rarity[0] });
      } else {
        queryBuilder.andWhere("token.rarity IN(:...rarity)", { rarity });
      }
    }

    if (tokenStatus) {
      if (tokenStatus.length === 1) {
        queryBuilder.andWhere("token.tokenStatus = :tokenStatus", { tokenStatus: tokenStatus[0] });
      } else {
        queryBuilder.andWhere("token.tokenStatus IN(:...tokenStatus)", { tokenStatus });
      }
    }

    if (erc998CollectionIds) {
      if (erc998CollectionIds.length === 1) {
        queryBuilder.andWhere("template.erc998CollectionId = :erc998CollectionId", {
          erc998CollectionId: erc998CollectionIds[0],
        });
      } else {
        queryBuilder.andWhere("template.erc998CollectionId IN(:...erc998CollectionIds)", { erc998CollectionIds });
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

  public async autocomplete(): Promise<Array<Erc998TokenEntity>> {
    const queryBuilder = this.erc998TokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select(["id", "tokenId"]);
    queryBuilder.leftJoin("token.template", "template");
    queryBuilder.addSelect(["template.title"]);

    queryBuilder.orderBy({
      "token.createdAt": "DESC",
    });

    return queryBuilder.getMany();
  }

  public findOne(
    where: FindOptionsWhere<Erc998TokenEntity>,
    options?: FindOneOptions<Erc998TokenEntity>,
  ): Promise<Erc998TokenEntity | null> {
    return this.erc998TokenEntityRepository.findOne({ where, ...options });
  }

  public async update(
    where: FindOptionsWhere<Erc998TokenEntity>,
    dto: IErc998TokenUpdateDto,
  ): Promise<Erc998TokenEntity> {
    const tokenEntity = await this.findOne(where);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    Object.assign(tokenEntity, dto);

    return tokenEntity.save();
  }
}
