import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindConditions, FindManyOptions, Repository } from "typeorm";

import { PageEntity } from "./page.entity";
import { IPageCreateDto, IPageUpdateDto } from "./interfaces";
import { PageStatus } from "@gemunion/framework-types";

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(PageEntity)
    private readonly pageEntityRepository: Repository<PageEntity>,
  ) {}

  public async search(): Promise<[Array<PageEntity>, number]> {
    return this.pageEntityRepository.findAndCount();
  }

  public findAndCount(
    where: FindConditions<PageEntity>,
    options?: FindManyOptions<PageEntity>,
  ): Promise<[Array<PageEntity>, number]> {
    return this.pageEntityRepository.findAndCount({ where, ...options });
  }

  public findOne(where: FindConditions<PageEntity>): Promise<PageEntity | undefined> {
    return this.pageEntityRepository.findOne({ where });
  }

  public async create(dto: IPageCreateDto): Promise<PageEntity> {
    const { slug } = dto;

    const productEntity = await this.pageEntityRepository.findOne({ slug });

    if (productEntity) {
      throw new ConflictException("duplicateSlug");
    }

    return this.pageEntityRepository
      .create({
        ...dto,
        pageStatus: PageStatus.ACTIVE,
      })
      .save();
  }

  public async update(where: FindConditions<PageEntity>, dto: IPageUpdateDto): Promise<PageEntity> {
    const pageEntity = await this.pageEntityRepository.findOne(where);

    if (!pageEntity) {
      throw new NotFoundException("pageNotFound");
    }

    Object.assign(pageEntity, dto);
    return pageEntity.save();
  }

  public delete(where: FindConditions<PageEntity>): Promise<DeleteResult> {
    return this.pageEntityRepository.delete(where);
  }
}
