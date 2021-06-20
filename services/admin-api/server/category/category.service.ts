import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, FindConditions, FindManyOptions, Repository} from "typeorm";

import {CategoryEntity} from "./category.entity";
import {ICategoryCreateDto, ICategoryUpdateDto} from "./interfaces";
import {ProductService} from "../product/product.service";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryEntityRepository: Repository<CategoryEntity>,
    private readonly productService: ProductService,
  ) {}

  public search(): Promise<[Array<CategoryEntity>, number]> {
    return this.findAndCount({});
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
