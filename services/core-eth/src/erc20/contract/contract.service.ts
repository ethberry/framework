import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { UniContractEntity } from "../../blockchain/uni-token/uni-contract/uni-contract.entity";

@Injectable()
export class Erc20ContractService {
  constructor(
    @InjectRepository(UniContractEntity)
    private readonly uniContractEntityRepository: Repository<UniContractEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<UniContractEntity>,
    options?: FindOneOptions<UniContractEntity>,
  ): Promise<UniContractEntity | null> {
    return this.uniContractEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<UniContractEntity>,
    options?: FindOneOptions<UniContractEntity>,
  ): Promise<Array<UniContractEntity>> {
    return this.uniContractEntityRepository.find({ where, ...options });
  }

  public async create(dto: DeepPartial<UniContractEntity>): Promise<UniContractEntity> {
    return this.uniContractEntityRepository.create(dto).save();
  }
}
