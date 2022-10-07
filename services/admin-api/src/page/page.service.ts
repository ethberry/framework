import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, DeleteResult, FindOptionsWhere, Repository } from "typeorm";

import { IPageSearchDto } from "@framework/types";

import { PageEntity } from "./page.entity";
import { IPageCreateDto, IPageUpdateDto } from "./interfaces";

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(PageEntity)
    private readonly pageEntityRepository: Repository<PageEntity>,
  ) {}

  public async search(dto: IPageSearchDto): Promise<[Array<PageEntity>, number]> {
    const { query, pageStatus, skip, take } = dto;

    const queryBuilder = this.pageEntityRepository.createQueryBuilder("page");

    queryBuilder.select();

    if (pageStatus) {
      if (pageStatus.length === 1) {
        queryBuilder.andWhere("page.pageStatus = :pageStatus", { pageStatus: pageStatus[0] });
      } else {
        queryBuilder.andWhere("page.pageStatus IN(:...pageStatus)", { pageStatus });
      }
    }

    if (query) {
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(page.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("page.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "page.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(where: FindOptionsWhere<PageEntity>): Promise<PageEntity | null> {
    return this.pageEntityRepository.findOne({ where });
  }

  public async create(dto: IPageCreateDto): Promise<PageEntity> {
    const { slug } = dto;

    const productEntity = await this.pageEntityRepository.findOne({ where: { slug } });

    if (productEntity) {
      throw new ConflictException("duplicateSlug");
    }

    return this.pageEntityRepository.create(dto).save();
  }

  public async update(where: FindOptionsWhere<PageEntity>, dto: IPageUpdateDto): Promise<PageEntity> {
    const pageEntity = await this.pageEntityRepository.findOne({ where });

    if (!pageEntity) {
      throw new NotFoundException("pageNotFound");
    }

    Object.assign(pageEntity, dto);
    return pageEntity.save();
  }

  public delete(where: FindOptionsWhere<PageEntity>): Promise<DeleteResult> {
    return this.pageEntityRepository.delete(where);
  }
}
