import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

import { Erc1155RecipeHistoryEntity } from "./recipe-history.entity";

@Injectable()
export class Erc1155RecipeHistoryService {
  constructor(
    @InjectRepository(Erc1155RecipeHistoryEntity)
    private readonly erc1155HistoryEntity: Repository<Erc1155RecipeHistoryEntity>,
  ) {}

  public async create(dto: DeepPartial<Erc1155RecipeHistoryEntity>): Promise<Erc1155RecipeHistoryEntity> {
    return this.erc1155HistoryEntity.create(dto).save();
  }
}
