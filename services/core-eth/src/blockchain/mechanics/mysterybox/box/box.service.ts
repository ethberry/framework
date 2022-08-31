import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { MysteryboxBoxEntity } from "./box.entity";

@Injectable()
export class MysteryboxBoxService {
  constructor(
    @InjectRepository(MysteryboxBoxEntity)
    private readonly mysteryboxEntityRepository: Repository<MysteryboxBoxEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<MysteryboxBoxEntity>,
    options?: FindOneOptions<MysteryboxBoxEntity>,
  ): Promise<MysteryboxBoxEntity | null> {
    return this.mysteryboxEntityRepository.findOne({ where, ...options });
  }
}
