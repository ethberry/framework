import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { WaitListListEntity } from "./list.entity";

@Injectable()
export class WaitListListService {
  constructor(
    @InjectRepository(WaitListListEntity)
    private readonly waitListListEntityRepository: Repository<WaitListListEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<WaitListListEntity>,
    options?: FindOneOptions<WaitListListEntity>,
  ): Promise<WaitListListEntity | null> {
    return this.waitListListEntityRepository.findOne({ where, ...options });
  }
}
