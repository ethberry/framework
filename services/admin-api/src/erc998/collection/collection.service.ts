import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";

import { Erc998CollectionStatus, IErc998CollectionAutocompleteDto, IErc998CollectionSearchDto } from "@framework/types";

import { Erc998CollectionEntity } from "./collection.entity";
import { IErc998CollectionUpdateDto } from "./interfaces";

@Injectable()
export class Erc998CollectionService {
  constructor(
    @InjectRepository(Erc998CollectionEntity)
    private readonly erc998CollectionEntityRepository: Repository<Erc998CollectionEntity>,
  ) {}

  public search(dto: IErc998CollectionSearchDto): Promise<[Array<Erc998CollectionEntity>, number]> {
    const { query, collectionStatus, collectionType, skip, take } = dto;

    const queryBuilder = this.erc998CollectionEntityRepository.createQueryBuilder("collection");

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

    if (collectionType) {
      if (collectionType.length === 1) {
        queryBuilder.andWhere("collection.collectionType = :collectionType", {
          collectionType: collectionType[0],
        });
      } else {
        queryBuilder.andWhere("collection.collectionType IN(:...collectionType)", { collectionType });
      }
    }

    queryBuilder.orderBy("collection.createdAt", "DESC");

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(dto: IErc998CollectionAutocompleteDto): Promise<Array<Erc998CollectionEntity>> {
    const { collectionType = [], collectionStatus = [] } = dto;

    const where = {};

    if (collectionType.length) {
      Object.assign(where, {
        collectionType: In(collectionType),
      });
    }

    if (collectionStatus.length) {
      Object.assign(where, {
        collectionStatus: In(collectionStatus),
      });
    }

    return this.erc998CollectionEntityRepository.find({
      where,
      select: {
        id: true,
        title: true,
        collectionType: true,
      },
    });
  }

  public findOne(
    where: FindOptionsWhere<Erc998CollectionEntity>,
    options?: FindOneOptions<Erc998CollectionEntity>,
  ): Promise<Erc998CollectionEntity | null> {
    return this.erc998CollectionEntityRepository.findOne({ where, ...options });
  }

  public async update(
    where: FindOptionsWhere<Erc998CollectionEntity>,
    dto: Partial<IErc998CollectionUpdateDto>,
  ): Promise<Erc998CollectionEntity> {
    const collectionEntity = await this.erc998CollectionEntityRepository.findOne({ where });

    if (!collectionEntity) {
      throw new NotFoundException("collectionNotFound");
    }

    Object.assign(collectionEntity, dto);

    return collectionEntity.save();
  }

  public async delete(where: FindOptionsWhere<Erc998CollectionEntity>): Promise<Erc998CollectionEntity> {
    return this.update(where, {
      collectionStatus: Erc998CollectionStatus.INACTIVE,
    });
  }
}
