import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

import { Erc721RecipeEntity } from "../recipe.entity";
import { Erc721IngredientEntity } from "./ingredient.entity";

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(Erc721IngredientEntity)
    private readonly ingredientEntityRepository: Repository<Erc721IngredientEntity>,
  ) {}

  public async create(
    dto: DeepPartial<Erc721IngredientEntity>,
    erc721RecipeEntity: Erc721RecipeEntity,
  ): Promise<Erc721IngredientEntity> {
    return this.ingredientEntityRepository
      .create({
        ...dto,
        erc721Recipe: erc721RecipeEntity,
      })
      .save();
  }
}
