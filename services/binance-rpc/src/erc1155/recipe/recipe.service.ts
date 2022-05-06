import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc1155RecipeEntity } from "./recipe.entity";

@Injectable()
export class Erc1155RecipeService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @InjectRepository(Erc1155RecipeEntity)
    private readonly recipeEntityRepository: Repository<Erc1155RecipeEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<Erc1155RecipeEntity>,
    options?: FindOneOptions<Erc1155RecipeEntity>,
  ): Promise<Erc1155RecipeEntity | null> {
    return this.recipeEntityRepository.findOne({ where, ...options });
  }
}
