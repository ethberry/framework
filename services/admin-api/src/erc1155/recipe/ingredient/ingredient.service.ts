import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

import { Erc1155RecipeEntity } from "../recipe.entity";
import { Erc1155IngredientEntity } from "./ingredient.entity";

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(Erc1155IngredientEntity)
    private readonly ingredientEntityRepository: Repository<Erc1155IngredientEntity>,
  ) {}

  public async create(
    dto: DeepPartial<Erc1155IngredientEntity>,
    erc1155RecipeEntity: Erc1155RecipeEntity,
  ): Promise<Erc1155IngredientEntity> {
    return this.ingredientEntityRepository
      .create({
        ...dto,
        erc1155Recipe: erc1155RecipeEntity,
      })
      .save();
  }
}
