import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { StakingStakesEntity } from "./stakes.entity";

@Injectable()
export class StakingStakesService {
  constructor(
    @InjectRepository(StakingStakesEntity)
    private readonly stakesEntityRepository: Repository<StakingStakesEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<StakingStakesEntity>,
    options?: FindOneOptions<StakingStakesEntity>,
  ): Promise<StakingStakesEntity | null> {
    return this.stakesEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<StakingStakesEntity>,
    options?: FindOneOptions<StakingStakesEntity>,
  ): Promise<Array<StakingStakesEntity>> {
    return this.stakesEntityRepository.find({ where, ...options });
  }

  public async create(dto: DeepPartial<StakingStakesEntity>): Promise<StakingStakesEntity> {
    return this.stakesEntityRepository.create(dto).save();
  }
}
