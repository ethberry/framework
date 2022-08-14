import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { VestingEntity } from "./vesting.entity";

@Injectable()
export class VestingService {
  constructor(
    @InjectRepository(VestingEntity)
    private readonly vestingEntityRepository: Repository<VestingEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<VestingEntity>,
    options?: FindOneOptions<VestingEntity>,
  ): Promise<VestingEntity | null> {
    return this.vestingEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<VestingEntity>,
    options?: FindOneOptions<VestingEntity>,
  ): Promise<Array<VestingEntity>> {
    return this.vestingEntityRepository.find({ where, ...options });
  }

  public async create(dto: DeepPartial<VestingEntity>): Promise<VestingEntity> {
    return this.vestingEntityRepository.create(dto).save();
  }
}
