import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { CraftEntity } from "./craft.entity";

@Injectable()
export class CraftService {
  constructor(
    @InjectRepository(CraftEntity)
    private readonly craftEntityRepository: Repository<CraftEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<CraftEntity>,
    options?: FindOneOptions<CraftEntity>,
  ): Promise<CraftEntity | null> {
    return this.craftEntityRepository.findOne({ where, ...options });
  }
}
