import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc721CollectionStatus } from "@framework/types";
import { ISearchDto } from "@gemunion/types-collection";

import { Erc1155CollectionEntity } from "./collection.entity";

@Injectable()
export class Erc1155CollectionService {
  constructor(
    @InjectRepository(Erc1155CollectionEntity)
    private readonly erc1155CollectionEntityRepository: Repository<Erc1155CollectionEntity>,
  ) {}

  public search(dto: ISearchDto): Promise<[Array<Erc1155CollectionEntity>, number]> {
    const { query, skip, take } = dto;

    const queryBuilder = this.erc1155CollectionEntityRepository.createQueryBuilder("collection");

    queryBuilder.select();

    if (query) {
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("collection.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("collection.description ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    queryBuilder.andWhere("collection.collectionStatus = :collectionStatus", {
      collectionStatus: Erc721CollectionStatus.ACTIVE,
    });

    queryBuilder.orderBy("collection.createdAt", "DESC");

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(): Promise<Array<Erc1155CollectionEntity>> {
    return this.erc1155CollectionEntityRepository.find({
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
}
