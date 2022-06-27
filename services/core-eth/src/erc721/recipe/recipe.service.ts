import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { CraftEntity } from "./recipe.entity";

@Injectable()
export class Erc721RecipeService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @InjectRepository(CraftEntity)
    private readonly recipeEntityRepository: Repository<CraftEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<CraftEntity>,
    options?: FindOneOptions<CraftEntity>,
  ): Promise<CraftEntity | null> {
    return this.recipeEntityRepository.findOne({ where, ...options });
  }
}
