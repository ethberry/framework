import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

import { Erc998RecipeHistoryEntity } from "./recipe-history.entity";

@Injectable()
export class Erc998RecipeHistoryService {
  constructor(
    @InjectRepository(Erc998RecipeHistoryEntity)
    private readonly erc998HistoryEntity: Repository<Erc998RecipeHistoryEntity>,
  ) {}

  public async create(dto: DeepPartial<Erc998RecipeHistoryEntity>): Promise<Erc998RecipeHistoryEntity> {
    return this.erc998HistoryEntity.create(dto).save();
  }
}
