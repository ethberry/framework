import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { DropboxStatus, IDropboxSearchDto } from "@framework/types";

import { DropboxEntity } from "./dropbox.entity";
import { IDropboxCreateDto, IDropboxUpdateDto } from "./interfaces";

@Injectable()
export class DropboxService {
  constructor(
    @InjectRepository(DropboxEntity)
    private readonly erc998DropboxEntityRepository: Repository<DropboxEntity>,
  ) {}

  public async search(dto: IDropboxSearchDto): Promise<[Array<DropboxEntity>, number]> {
    const { query, dropboxStatus, skip, take, uniContractIds } = dto;

    const queryBuilder = this.erc998DropboxEntityRepository.createQueryBuilder("dropbox");

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

    if (uniContractIds) {
      if (uniContractIds.length === 1) {
        queryBuilder.andWhere("dropbox.uniContractId = :uniContractId", {
          uniContractId: uniContractIds[0],
        });
      } else {
        queryBuilder.andWhere("dropbox.uniContractId IN(:...uniContractIds)", { uniContractIds });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "dropbox.title": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(): Promise<Array<DropboxEntity>> {
    return this.erc998DropboxEntityRepository.find({
      select: {
        id: true,
        title: true,
      },
    });
  }

  public findOne(
    where: FindOptionsWhere<DropboxEntity>,
    options?: FindOneOptions<DropboxEntity>,
  ): Promise<DropboxEntity | null> {
    return this.erc998DropboxEntityRepository.findOne({ where, ...options });
  }

  public async update(where: FindOptionsWhere<DropboxEntity>, dto: Partial<IDropboxUpdateDto>): Promise<DropboxEntity> {
    const templateEntity = await this.findOne(where);

    if (!templateEntity) {
      throw new NotFoundException("dropboxNotFound");
    }

    Object.assign(templateEntity, dto);

    return templateEntity.save();
  }

  public async create(dto: IDropboxCreateDto): Promise<DropboxEntity> {
    return this.erc998DropboxEntityRepository.create(dto).save();
  }

  public async delete(where: FindOptionsWhere<DropboxEntity>): Promise<DropboxEntity> {
    return this.update(where, { dropboxStatus: DropboxStatus.INACTIVE });
  }
}
