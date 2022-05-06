import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc721DropboxStatus, IErc721DropboxSearchDto } from "@framework/types";

import { Erc721DropboxEntity } from "./dropbox.entity";
import { IErc721DropboxCreateDto, IErc721DropboxUpdateDto } from "./interfaces";

@Injectable()
export class Erc721DropboxService {
  constructor(
    @InjectRepository(Erc721DropboxEntity)
    private readonly erc721DropboxEntityRepository: Repository<Erc721DropboxEntity>,
  ) {}

  public async search(dto: IErc721DropboxSearchDto): Promise<[Array<Erc721DropboxEntity>, number]> {
    const { query, dropboxStatus, skip, take, erc721CollectionIds } = dto;

    const queryBuilder = this.erc721DropboxEntityRepository.createQueryBuilder("dropbox");

    queryBuilder.select();

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

    if (dropboxStatus) {
      if (dropboxStatus.length === 1) {
        queryBuilder.andWhere("dropbox.dropboxStatus = :dropboxStatus", { dropboxStatus: dropboxStatus[0] });
      } else {
        queryBuilder.andWhere("dropbox.dropboxStatus IN(:...dropboxStatus)", { dropboxStatus });
      }
    }

    if (erc721CollectionIds) {
      if (erc721CollectionIds.length === 1) {
        queryBuilder.andWhere("dropbox.erc721CollectionId = :erc721CollectionId", {
          erc721CollectionId: erc721CollectionIds[0],
        });
      } else {
        queryBuilder.andWhere("dropbox.erc721CollectionId IN(:...erc721CollectionIds)", { erc721CollectionIds });
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

  public async update(
    where: FindOptionsWhere<Erc721DropboxEntity>,
    dto: Partial<IErc721DropboxUpdateDto>,
  ): Promise<Erc721DropboxEntity> {
    const templateEntity = await this.findOne(where);

    if (!templateEntity) {
      throw new NotFoundException("dropboxNotFound");
    }

    Object.assign(templateEntity, dto);

    return templateEntity.save();
  }

  public async create(dto: IErc721DropboxCreateDto): Promise<Erc721DropboxEntity> {
    return this.erc721DropboxEntityRepository.create(dto).save();
  }

  public async delete(where: FindOptionsWhere<Erc721DropboxEntity>): Promise<Erc721DropboxEntity> {
    return this.update(where, { dropboxStatus: Erc721DropboxStatus.INACTIVE });
  }
}
