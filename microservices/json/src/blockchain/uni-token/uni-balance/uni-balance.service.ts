import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { UniBalanceEntity } from "./uni-balance.entity";

@Injectable()
export class UniBalanceService {
  constructor(
    @InjectRepository(UniBalanceEntity)
    private readonly uniBalanceEntityRepository: Repository<UniBalanceEntity>,
  ) {}

  public findAll(
    where: FindOptionsWhere<UniBalanceEntity>,
    options?: FindOneOptions<UniBalanceEntity>,
  ): Promise<Array<UniBalanceEntity>> {
    return this.uniBalanceEntityRepository.find({ where, ...options });
  }
}
