import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { MysteryBoxEntity } from "./box.entity";

@Injectable()
export class MysteryBoxService {
  constructor(
    @InjectRepository(MysteryBoxEntity)
    private readonly mysteryboxEntityRepository: Repository<MysteryBoxEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<MysteryBoxEntity>,
    options?: FindOneOptions<MysteryBoxEntity>,
  ): Promise<MysteryBoxEntity | null> {
    return this.mysteryboxEntityRepository.findOne({ where, ...options });
  }
}
