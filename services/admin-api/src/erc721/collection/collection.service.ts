import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";

import { Erc721CollectionStatus, IErc721CollectionAutocompleteDto, IErc721CollectionSearchDto } from "@framework/types";

import { Erc721CollectionEntity } from "./collection.entity";
import { IErc721CollectionUpdateDto } from "./interfaces";

@Injectable()
export class Erc721CollectionService {
  constructor(
    @InjectRepository(Erc721CollectionEntity)
    private readonly erc721CollectionEntityRepository: Repository<Erc721CollectionEntity>,
  ) {}

  public search(dto: IErc721CollectionSearchDto): Promise<[Array<Erc721CollectionEntity>, number]> {
    const { query, collectionStatus, collectionType, skip, take } = dto;

    const queryBuilder = this.erc721CollectionEntityRepository.createQueryBuilder("collection");

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

  public async autocomplete(dto: IErc721CollectionAutocompleteDto): Promise<Array<Erc721CollectionEntity>> {
    return this.erc721CollectionEntityRepository.find({
      where: {
        collectionType: In(dto.collectionType),
      },
      select: {
        id: true,
        title: true,
      },
    });
  }

  public findOne(
    where: FindOptionsWhere<Erc721CollectionEntity>,
    options?: FindOneOptions<Erc721CollectionEntity>,
  ): Promise<Erc721CollectionEntity | null> {
    return this.erc721CollectionEntityRepository.findOne({ where, ...options });
  }

  public async update(
    where: FindOptionsWhere<Erc721CollectionEntity>,
    dto: Partial<IErc721CollectionUpdateDto>,
  ): Promise<Erc721CollectionEntity> {
    const collectionEntity = await this.erc721CollectionEntityRepository.findOne({ where });

    if (!collectionEntity) {
      throw new NotFoundException("collectionNotFound");
    }

    Object.assign(collectionEntity, dto);

    return collectionEntity.save();
  }

  public async delete(where: FindOptionsWhere<Erc721CollectionEntity>): Promise<Erc721CollectionEntity> {
    return this.update(where, {
      collectionStatus: Erc721CollectionStatus.INACTIVE,
    });
  }
}
