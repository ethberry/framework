import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ISearchDto } from "@gemunion/types-collection";

import { Erc721CollectionEntity } from "./collection.entity";
import { Erc721CollectionType } from "@framework/types";

@Injectable()
export class Erc721CollectionService {
  constructor(
    @InjectRepository(Erc721CollectionEntity)
    private readonly erc721CollectionEntityRepository: Repository<Erc721CollectionEntity>,
  ) {}

  public search(dto: ISearchDto): Promise<[Array<Erc721CollectionEntity>, number]> {
    const { query, skip, take } = dto;

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

    queryBuilder.andWhere("collection.collectionType IN(:...collectionTypes)", {
      collectionTypes: [Erc721CollectionType.TOKEN, Erc721CollectionType.DROPBOX],
    });

    queryBuilder.orderBy("collection.createdAt", "DESC");

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(): Promise<Array<Erc721CollectionEntity>> {
    return this.erc721CollectionEntityRepository.find({
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
}
