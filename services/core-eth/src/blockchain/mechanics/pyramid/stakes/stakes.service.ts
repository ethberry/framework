import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { PyramidStakesEntity } from "./stakes.entity";

@Injectable()
export class PyramidStakesService {
  constructor(
    @InjectRepository(PyramidStakesEntity)
    private readonly stakesEntityRepository: Repository<PyramidStakesEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<PyramidStakesEntity>,
    options?: FindOneOptions<PyramidStakesEntity>,
  ): Promise<PyramidStakesEntity | null> {
    return this.stakesEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<PyramidStakesEntity>,
    options?: FindOneOptions<PyramidStakesEntity>,
  ): Promise<Array<PyramidStakesEntity>> {
    return this.stakesEntityRepository.find({ where, ...options });
  }

  public async create(dto: DeepPartial<PyramidStakesEntity>): Promise<PyramidStakesEntity> {
    return this.stakesEntityRepository.create(dto).save();
  }

  public async findStake(externalId: string, contractId: number): Promise<PyramidStakesEntity | null> {
    return await this.stakesEntityRepository.findOne({
      where: {
        externalId,
        pyramidRule: {
          contractId,
        },
      },
      join: {
        alias: "stake",
        leftJoinAndSelect: {
          pyramidRule: "stake.pyramidRule",
        },
      },
    });
  }
}
