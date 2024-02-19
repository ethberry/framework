import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { PonziDepositEntity } from "./deposit.entity";

@Injectable()
export class PonziDepositService {
  constructor(
    @InjectRepository(PonziDepositEntity)
    private readonly stakesEntityRepository: Repository<PonziDepositEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<PonziDepositEntity>,
    options?: FindOneOptions<PonziDepositEntity>,
  ): Promise<PonziDepositEntity | null> {
    return this.stakesEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<PonziDepositEntity>,
    options?: FindManyOptions<PonziDepositEntity>,
  ): Promise<Array<PonziDepositEntity>> {
    return this.stakesEntityRepository.find({ where, ...options });
  }

  public async create(dto: DeepPartial<PonziDepositEntity>): Promise<PonziDepositEntity> {
    return this.stakesEntityRepository.create(dto).save();
  }

  public async findStake(externalId: string, contractId: number): Promise<PonziDepositEntity | null> {
    return this.stakesEntityRepository.findOne({
      where: {
        externalId,
        ponziRule: {
          contractId,
        },
      },
      join: {
        alias: "stake",
        leftJoinAndSelect: {
          ponziRule: "stake.ponziRule",
        },
      },
    });
  }
}
