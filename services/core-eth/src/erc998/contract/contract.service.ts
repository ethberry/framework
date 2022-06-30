import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { UniContractEntity } from "../../blockchain/uni-token/uni-contract/uni-contract.entity";

@Injectable()
export class Erc998CollectionService {
  constructor(
    @InjectRepository(UniContractEntity)
    private readonly erc998CollectionEntityRepository: Repository<UniContractEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<UniContractEntity>,
    options?: FindOneOptions<UniContractEntity>,
  ): Promise<UniContractEntity | null> {
    return this.erc998CollectionEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<UniContractEntity>,
    options?: FindOneOptions<UniContractEntity>,
  ): Promise<Array<UniContractEntity>> {
    return this.erc998CollectionEntityRepository.find({ where, ...options });
  }

  public async create(dto: DeepPartial<UniContractEntity>): Promise<UniContractEntity> {
    return this.erc998CollectionEntityRepository.create(dto).save();
  }
}
