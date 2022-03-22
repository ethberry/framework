import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, FindManyOptions, Repository } from "typeorm";

import { CategoryEntity } from "./category.entity";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryEntityRepository: Repository<CategoryEntity>,
  ) {}

  public findAndCount(
    where: FindOptionsWhere<CategoryEntity>,
    options?: FindManyOptions<CategoryEntity>,
  ): Promise<[Array<CategoryEntity>, number]> {
    return this.categoryEntityRepository.findAndCount({ where, ...options });
  }

  public async autocomplete(): Promise<Array<CategoryEntity>> {
    return this.categoryEntityRepository.find({
      select: ["id", "title"],
    });
  }
}
