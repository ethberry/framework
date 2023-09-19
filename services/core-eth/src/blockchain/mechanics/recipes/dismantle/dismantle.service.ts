import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { DismantleEntity } from "./dismantle.entity";

@Injectable()
export class DismantleService {
  constructor(
    @InjectRepository(DismantleEntity)
    private readonly dismantleEntityRepository: Repository<DismantleEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<DismantleEntity>,
    options?: FindOneOptions<DismantleEntity>,
  ): Promise<DismantleEntity | null> {
    return this.dismantleEntityRepository.findOne({ where, ...options });
  }
}
