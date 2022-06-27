import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IErc998DropboxSearchDto } from "@framework/types";

import { Erc998DropboxEntity } from "./dropbox.entity";

@Injectable()
export class Erc998DropboxService {
  constructor(
    @InjectRepository(Erc998DropboxEntity)
    private readonly erc998DropboxEntityRepository: Repository<Erc998DropboxEntity>,
  ) {}

  public async search(dto: IErc998DropboxSearchDto): Promise<[Array<Erc998DropboxEntity>, number]> {
    const { query, dropboxStatus, skip, take, erc998CollectionIds, erc998TemplateCollectionIds, minPrice, maxPrice } =
      dto;

    const queryBuilder = this.erc998DropboxEntityRepository.createQueryBuilder("dropbox");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("dropbox.erc998Collection", "collection");
    queryBuilder.leftJoinAndSelect("dropbox.erc998Template", "template");
    queryBuilder.leftJoinAndSelect("dropbox.erc20Token", "erc20_token");

    if (erc998CollectionIds) {
      if (erc998CollectionIds.length === 1) {
        queryBuilder.andWhere("dropbox.erc998CollectionId = :erc998CollectionId", {
          erc998CollectionId: erc998CollectionIds[0],
        });
      } else {
        queryBuilder.andWhere("dropbox.erc998CollectionId IN(:...erc998CollectionIds)", { erc998CollectionIds });
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

    if (erc998TemplateCollectionIds) {
      if (erc998TemplateCollectionIds.length === 1) {
        queryBuilder.andWhere("template.erc998CollectionId = :templateErc998CollectionId", {
          templateErc998CollectionId: erc998TemplateCollectionIds[0],
        });
      } else {
        queryBuilder.andWhere("template.erc998CollectionId IN(:...templateErc998CollectionIds)", {
          templateErc998CollectionIds: erc998TemplateCollectionIds,
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
    where: FindOptionsWhere<Erc998DropboxEntity>,
    options?: FindOneOptions<Erc998DropboxEntity>,
  ): Promise<Erc998DropboxEntity | null> {
    return this.erc998DropboxEntityRepository.findOne({ where, ...options });
  }
}
