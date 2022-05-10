import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc721RecipeEntity } from "./recipe.entity";

@Injectable()
export class Erc721RecipeService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @InjectRepository(Erc721RecipeEntity)
    private readonly recipeEntityRepository: Repository<Erc721RecipeEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<Erc721RecipeEntity>,
    options?: FindOneOptions<Erc721RecipeEntity>,
  ): Promise<Erc721RecipeEntity | null> {
    return this.recipeEntityRepository.findOne({ where, ...options });
  }
}
