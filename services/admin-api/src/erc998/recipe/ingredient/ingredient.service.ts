import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

import { Erc998RecipeEntity } from "../recipe.entity";
import { Erc998IngredientEntity } from "./ingredient.entity";

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(Erc998IngredientEntity)
    private readonly ingredientEntityRepository: Repository<Erc998IngredientEntity>,
  ) {}

  public async create(
    dto: DeepPartial<Erc998IngredientEntity>,
    erc998RecipeEntity: Erc998RecipeEntity,
  ): Promise<Erc998IngredientEntity> {
    return this.ingredientEntityRepository
      .create({
        ...dto,
        erc998Recipe: erc998RecipeEntity,
      })
      .save();
  }
}
