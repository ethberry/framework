import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { VestingEntity } from "./vesting.entity";

@Injectable()
export class VestingService {
  constructor(
    @InjectRepository(VestingEntity)
    private readonly VestingEntityRepository: Repository<VestingEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<VestingEntity>,
    options?: FindOneOptions<VestingEntity>,
  ): Promise<VestingEntity | null> {
    return this.VestingEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<VestingEntity>,
    options?: FindOneOptions<VestingEntity>,
  ): Promise<Array<VestingEntity>> {
    return this.VestingEntityRepository.find({ where, ...options });
  }

  public async create(dto: DeepPartial<VestingEntity>): Promise<VestingEntity> {
    return this.VestingEntityRepository.create(dto).save();
  }
}
