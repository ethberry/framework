import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { MysteryboxEntity } from "./mysterybox.entity";

@Injectable()
export class MysteryboxService {
  constructor(
    @InjectRepository(MysteryboxEntity)
    private readonly mysteryboxEntityRepository: Repository<MysteryboxEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<MysteryboxEntity>,
    options?: FindOneOptions<MysteryboxEntity>,
  ): Promise<MysteryboxEntity | null> {
    return this.mysteryboxEntityRepository.findOne({ where, ...options });
  }
}
