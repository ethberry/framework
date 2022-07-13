import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IDropboxSearchDto } from "@framework/types";

import { DropboxEntity } from "./dropbox.entity";

@Injectable()
export class DropboxService {
  constructor(
    @InjectRepository(DropboxEntity)
    private readonly erc998DropboxEntityRepository: Repository<DropboxEntity>,
  ) {}

  public async search(dto: IDropboxSearchDto): Promise<[Array<DropboxEntity>, number]> {
    const { query, dropboxStatus, skip, take, contractIds, templateContractIds } = dto;

    const queryBuilder = this.erc998DropboxEntityRepository.createQueryBuilder("dropbox");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("dropbox.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.token", "item_token");
    queryBuilder.leftJoinAndSelect("item_token.template", "item_template");

    if (contractIds) {
      if (contractIds.length === 1) {
        queryBuilder.andWhere("dropbox.contractId = :contractId", {
          contractId: contractIds[0],
        });
      } else {
        queryBuilder.andWhere("dropbox.contractId IN(:...contractIds)", { contractIds });
      }
    }

    if (dropboxStatus) {
      if (dropboxStatus.length === 1) {
        queryBuilder.andWhere("dropbox.dropboxStatus = :dropboxStatus", { dropboxStatus: dropboxStatus[0] });
      } else {
        queryBuilder.andWhere("dropbox.dropboxStatus IN(:...dropboxStatus)", { dropboxStatus });
      }
    }

    // TODO restore
    // if (maxPrice) {
    //   queryBuilder.andWhere("dropbox.price <= :maxPrice", { maxPrice });
    // }
    //
    // if (minPrice) {
    //   queryBuilder.andWhere("dropbox.price >= :minPrice", { minPrice });
    // }

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

    if (templateContractIds) {
      if (templateContractIds.length === 1) {
        queryBuilder.andWhere("template.contractId = :contractId", {
          templateContractId: templateContractIds[0],
        });
      } else {
        queryBuilder.andWhere("template.contractId IN(:...templateContractIds)", {
          templateContractIds,
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
    where: FindOptionsWhere<DropboxEntity>,
    options?: FindOneOptions<DropboxEntity>,
  ): Promise<DropboxEntity | null> {
    return this.erc998DropboxEntityRepository.findOne({ where, ...options });
  }
}
