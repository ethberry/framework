import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

import { Erc721RecipeHistoryEntity } from "./recipe-history.entity";

@Injectable()
export class Erc721RecipeHistoryService {
  constructor(
    @InjectRepository(Erc721RecipeHistoryEntity)
    private readonly erc721HistoryEntity: Repository<Erc721RecipeHistoryEntity>,
  ) {}

  public async create(dto: DeepPartial<Erc721RecipeHistoryEntity>): Promise<Erc721RecipeHistoryEntity> {
    return this.erc721HistoryEntity.create(dto).save();
  }
}
