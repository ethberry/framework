import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc20VestingEntity } from "./vesting.entity";

@Injectable()
export class Erc20VestingService {
  constructor(
    @InjectRepository(Erc20VestingEntity)
    private readonly erc20VestingEntityRepository: Repository<Erc20VestingEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<Erc20VestingEntity>,
    options?: FindOneOptions<Erc20VestingEntity>,
  ): Promise<Erc20VestingEntity | null> {
    return this.erc20VestingEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: DeepPartial<Erc20VestingEntity>): Promise<Erc20VestingEntity> {
    return this.erc20VestingEntityRepository.create(dto).save();
  }
}
