import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";

import {
  Erc1155CollectionStatus,
  IErc1155CollectionAutocompleteDto,
  IErc1155CollectionSearchDto,
} from "@framework/types";

import { Erc1155CollectionEntity } from "./collection.entity";
import { IErc1155CollectionUpdateDto } from "./interfaces";

@Injectable()
export class Erc1155CollectionService {
  constructor(
    @InjectRepository(Erc1155CollectionEntity)
    private readonly erc1155CollectionEntityRepository: Repository<Erc1155CollectionEntity>,
  ) {}

  public search(dto: IErc1155CollectionSearchDto): Promise<[Array<Erc1155CollectionEntity>, number]> {
    const { query, collectionStatus, skip, take } = dto;

    const queryBuilder = this.erc1155CollectionEntityRepository.createQueryBuilder("collection");

    queryBuilder.select();

    if (query) {
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(collection.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("collection.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    if (collectionStatus) {
      if (collectionStatus.length === 1) {
        queryBuilder.andWhere("collection.collectionStatus = :collectionStatus", {
          collectionStatus: collectionStatus[0],
        });
      } else {
        queryBuilder.andWhere("collection.collectionStatus IN(:...collectionStatus)", { collectionStatus });
      }
    }

    queryBuilder.orderBy("collection.createdAt", "DESC");

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(dto: IErc1155CollectionAutocompleteDto): Promise<Array<Erc1155CollectionEntity>> {
    const { collectionStatus = [] } = dto;

    const where = {};

    if (collectionStatus.length) {
      Object.assign(where, {
        collectionStatus: In(collectionStatus),
      });
    }

    return this.erc1155CollectionEntityRepository.find({
      where,
      select: {
        id: true,
        title: true,
      },
    });
  }

  public findOne(
    where: FindOptionsWhere<Erc1155CollectionEntity>,
    options?: FindOneOptions<Erc1155CollectionEntity>,
  ): Promise<Erc1155CollectionEntity | null> {
    return this.erc1155CollectionEntityRepository.findOne({ where, ...options });
  }

  public async update(
    where: FindOptionsWhere<Erc1155CollectionEntity>,
    dto: Partial<IErc1155CollectionUpdateDto>,
  ): Promise<Erc1155CollectionEntity> {
    const collectionEntity = await this.erc1155CollectionEntityRepository.findOne({ where });

    if (!collectionEntity) {
      throw new NotFoundException("collectionNotFound");
    }

    Object.assign(collectionEntity, dto);

    return collectionEntity.save();
  }

  public async delete(where: FindOptionsWhere<Erc1155CollectionEntity>): Promise<Erc1155CollectionEntity> {
    return this.update(where, {
      collectionStatus: Erc1155CollectionStatus.INACTIVE,
    });
  }
}
