import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ContractEntity } from "../../blockchain/hierarchy/contract/contract.entity";

@Injectable()
export class Erc998CollectionService {
  constructor(
    @InjectRepository(ContractEntity)
    private readonly erc998CollectionEntityRepository: Repository<ContractEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<ContractEntity>,
    options?: FindOneOptions<ContractEntity>,
  ): Promise<ContractEntity | null> {
    return this.erc998CollectionEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<ContractEntity>,
    options?: FindOneOptions<ContractEntity>,
  ): Promise<Array<ContractEntity>> {
    return this.erc998CollectionEntityRepository.find({ where, ...options });
  }

  public async create(dto: DeepPartial<ContractEntity>): Promise<ContractEntity> {
    return this.erc998CollectionEntityRepository.create(dto).save();
  }
}
