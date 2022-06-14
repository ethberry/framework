import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ISearchDto } from "@gemunion/types-collection";

import { Erc998CollectionEntity } from "./collection.entity";
import { Erc998CollectionType } from "@framework/types";

@Injectable()
export class Erc998CollectionService {
  constructor(
    @InjectRepository(Erc998CollectionEntity)
    private readonly erc998CollectionEntityRepository: Repository<Erc998CollectionEntity>,
  ) {}

  public search(dto: ISearchDto): Promise<[Array<Erc998CollectionEntity>, number]> {
    const { query, skip, take } = dto;

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

    queryBuilder.andWhere("collection.collectionType IN(:...collectionTypes)", {
      collectionTypes: [Erc998CollectionType.TOKEN, Erc998CollectionType.DROPBOX],
    });

    queryBuilder.orderBy("collection.createdAt", "DESC");

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(): Promise<Array<Erc998CollectionEntity>> {
    return this.erc998CollectionEntityRepository.find({
      select: {
        id: true,
        title: true,
      },
    });
  }

  public findOne(
    where: FindOptionsWhere<Erc998CollectionEntity>,
    options?: FindOneOptions<Erc998CollectionEntity>,
  ): Promise<Erc998CollectionEntity | null> {
    return this.erc998CollectionEntityRepository.findOne({ where, ...options });
  }
}
