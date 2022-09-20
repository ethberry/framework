import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { PyramidDepositEntity } from "./deposit.entity";

@Injectable()
export class PyramidDepositService {
  constructor(
    @InjectRepository(PyramidDepositEntity)
    private readonly stakesEntityRepository: Repository<PyramidDepositEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<PyramidDepositEntity>,
    options?: FindOneOptions<PyramidDepositEntity>,
  ): Promise<PyramidDepositEntity | null> {
    return this.stakesEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<PyramidDepositEntity>,
    options?: FindOneOptions<PyramidDepositEntity>,
  ): Promise<Array<PyramidDepositEntity>> {
    return this.stakesEntityRepository.find({ where, ...options });
  }

  public async create(dto: DeepPartial<PyramidDepositEntity>): Promise<PyramidDepositEntity> {
    return this.stakesEntityRepository.create(dto).save();
  }

  public async findStake(externalId: string, contractId: number): Promise<PyramidDepositEntity | null> {
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
