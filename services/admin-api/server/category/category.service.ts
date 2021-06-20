import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Brackets, DeleteResult, FindConditions, FindManyOptions, Repository} from "typeorm";

import {ISearchDto} from "@trejgun/types-collection";

import {CategoryEntity} from "./category.entity";
import {ICategoryCreateDto, ICategoryUpdateDto} from "./interfaces";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryEntityRepository: Repository<CategoryEntity>,
  ) {}

  public search(dto: ISearchDto): Promise<[Array<CategoryEntity>, number]> {
    const {query, skip, take} = dto;

    const queryBuilder = this.categoryEntityRepository.createQueryBuilder("category");

    queryBuilder.select();

    if (query) {
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("category.title ILIKE '%' || :title || '%'", {title: query});
          qb.orWhere("category.description ILIKE '%' || :description || '%'", {description: query});
        }),
      );
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy("category.createdAt", "DESC");

    return queryBuilder.getManyAndCount();
  }

  public findAndCount(
    where: FindConditions<CategoryEntity>,
    options?: FindManyOptions<CategoryEntity>,
  ): Promise<[Array<CategoryEntity>, number]> {
    return this.categoryEntityRepository.findAndCount({where, ...options});
  }

  public findOne(where: FindConditions<CategoryEntity>): Promise<CategoryEntity | undefined> {
    return this.categoryEntityRepository.findOne({where});
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
    where: FindConditions<CategoryEntity>,
    data: ICategoryUpdateDto,
  ): Promise<CategoryEntity | undefined> {
    const categoryEntity = await this.categoryEntityRepository.findOne(where);

    if (!categoryEntity) {
      throw new NotFoundException("categoryNotFound");
    }

    Object.assign(categoryEntity, data);
    return categoryEntity.save();
  }

  public async delete(where: FindConditions<CategoryEntity>): Promise<DeleteResult> {
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
