import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IErc721DropboxSearchDto } from "@framework/types";

import { Erc721DropboxEntity } from "./dropbox.entity";

@Injectable()
export class Erc721DropboxService {
  constructor(
    @InjectRepository(Erc721DropboxEntity)
    private readonly erc721DropboxEntityRepository: Repository<Erc721DropboxEntity>,
  ) {}

  public async search(dto: IErc721DropboxSearchDto): Promise<[Array<Erc721DropboxEntity>, number]> {
    const { query, dropboxStatus, skip, take, erc721CollectionIds, erc721TemplateCollectionIds, minPrice, maxPrice } =
      dto;

    const queryBuilder = this.erc721DropboxEntityRepository.createQueryBuilder("dropbox");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("dropbox.erc721Collection", "collection");
    queryBuilder.leftJoinAndSelect("dropbox.erc721Template", "template");
    queryBuilder.leftJoinAndSelect("dropbox.erc20Token", "erc20_token");

    if (erc721CollectionIds) {
      if (erc721CollectionIds.length === 1) {
        queryBuilder.andWhere("dropbox.erc721CollectionId = :erc721CollectionId", {
          erc721CollectionId: erc721CollectionIds[0],
        });
      } else {
        queryBuilder.andWhere("dropbox.erc721CollectionId IN(:...erc721CollectionIds)", { erc721CollectionIds });
      }
    }

    if (dropboxStatus) {
      if (dropboxStatus.length === 1) {
        queryBuilder.andWhere("dropbox.dropboxStatus = :dropboxStatus", { dropboxStatus: dropboxStatus[0] });
      } else {
        queryBuilder.andWhere("dropbox.dropboxStatus IN(:...dropboxStatus)", { dropboxStatus });
      }
    }

    if (maxPrice) {
      queryBuilder.andWhere("dropbox.price <= :maxPrice", { maxPrice });
    }

    if (minPrice) {
      queryBuilder.andWhere("dropbox.price >= :minPrice", { minPrice });
    }

    if (query) {
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(dropbox.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("dropbox.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    if (erc721TemplateCollectionIds) {
      if (erc721TemplateCollectionIds.length === 1) {
        queryBuilder.andWhere("template.erc721CollectionId = :templateErc721CollectionId", {
          templateErc721CollectionId: erc721TemplateCollectionIds[0],
        });
      } else {
        queryBuilder.andWhere("template.erc721CollectionId IN(:...templateErc721CollectionIds)", {
          templateErc721CollectionIds: erc721TemplateCollectionIds,
        });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "dropbox.title": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<Erc721DropboxEntity>,
    options?: FindOneOptions<Erc721DropboxEntity>,
  ): Promise<Erc721DropboxEntity | null> {
    return this.erc721DropboxEntityRepository.findOne({ where, ...options });
  }
}
