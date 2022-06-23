import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc998RecipeEntity } from "./recipe.entity";

@Injectable()
export class Erc998RecipeService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @InjectRepository(Erc998RecipeEntity)
    private readonly recipeEntityRepository: Repository<Erc998RecipeEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<Erc998RecipeEntity>,
    options?: FindOneOptions<Erc998RecipeEntity>,
  ): Promise<Erc998RecipeEntity | null> {
    return this.recipeEntityRepository.findOne({ where, ...options });
  }
}
