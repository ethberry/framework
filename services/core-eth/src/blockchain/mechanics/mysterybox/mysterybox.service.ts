import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { MysteryboxBoxEntity } from "./mysterybox.entity";

@Injectable()
export class MysteryboxService {
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
