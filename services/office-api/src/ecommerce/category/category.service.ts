import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { ISearchDto } from "@gemunion/types-collection";

import { CategoryEntity } from "./category.entity";
import type { ICategoryCreateDto, ICategoryUpdateDto } from "./interfaces";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryEntityRepository: Repository<CategoryEntity>,
  ) {}

  public search(dto: ISearchDto): Promise<[Array<CategoryEntity>, number]> {
    const { query, skip, take } = dto;

    const queryBuilder = this.categoryEntityRepository.createQueryBuilder("category");

    queryBuilder.select();

    if (query) {
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(category.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("category.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy("category.createdAt", "DESC");

    return queryBuilder.getManyAndCount();
  }

  public findAndCount(
    where: FindOptionsWhere<CategoryEntity>,
    options?: FindManyOptions<CategoryEntity>,
  ): Promise<[Array<CategoryEntity>, number]> {
    return this.categoryEntityRepository.findAndCount({ where, ...options });
  }

  public findOne(
    where: FindOptionsWhere<CategoryEntity>,
    options?: FindOneOptions<CategoryEntity>,
  ): Promise<CategoryEntity | null> {
    return this.categoryEntityRepository.findOne({ where, ...options });
  }

  public async autocomplete(): Promise<Array<CategoryEntity>> {
    return this.categoryEntityRepository.find({
      select: ["id", "title"],
    });
  }

  public async create(data: ICategoryCreateDto): Promise<CategoryEntity> {
    return this.categoryEntityRepository
      .create({
        ...data,
      })
      .save();
  }

  public async update(
    where: FindOptionsWhere<CategoryEntity>,
    data: ICategoryUpdateDto,
  ): Promise<CategoryEntity | undefined> {
    const categoryEntity = await this.categoryEntityRepository.findOne({ where });

    if (!categoryEntity) {
      throw new NotFoundException("categoryNotFound");
    }

    Object.assign(categoryEntity, data);
    return categoryEntity.save();
  }

  public async delete(where: FindOptionsWhere<CategoryEntity>): Promise<DeleteResult> {
    if (where.id === 1) {
      throw new BadRequestException("cantDeleteRootCategory");
    }

    const queryBuilder = this.categoryEntityRepository.createQueryBuilder("category");

    queryBuilder.select();

    queryBuilder.where(where);

    queryBuilder.leftJoinAndSelect("category.children", "category_children");

    const categoryEntity = await queryBuilder.getOne();

    if (!categoryEntity) {
      throw new NotFoundException("categoryNotFound");
    }

    if (categoryEntity.children.length) {
      throw new BadRequestException("cantDeleteNotEmptyCategory");
    }

    return this.categoryEntityRepository.delete(where);
  }
}
