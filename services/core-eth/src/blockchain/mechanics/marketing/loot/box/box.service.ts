import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { LootBoxEntity } from "./box.entity";

@Injectable()
export class LootBoxService {
  constructor(
    @InjectRepository(LootBoxEntity)
    private readonly lootBoxEntityRepository: Repository<LootBoxEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<LootBoxEntity>,
    options?: FindOneOptions<LootBoxEntity>,
  ): Promise<LootBoxEntity | null> {
    return this.lootBoxEntityRepository.findOne({ where, ...options });
  }
}
