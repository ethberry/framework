import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { UniContractEntity } from "./collection.entity";

@Injectable()
export class Erc721CollectionService {
  constructor(
    @InjectRepository(UniContractEntity)
    private readonly erc721CollectionEntityRepository: Repository<UniContractEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<UniContractEntity>,
    options?: FindOneOptions<UniContractEntity>,
  ): Promise<UniContractEntity | null> {
    return this.erc721CollectionEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<UniContractEntity>,
    options?: FindOneOptions<UniContractEntity>,
  ): Promise<Array<UniContractEntity>> {
    return this.erc721CollectionEntityRepository.find({ where, ...options });
  }

  public async create(dto: DeepPartial<UniContractEntity>): Promise<UniContractEntity> {
    return this.erc721CollectionEntityRepository.create(dto).save();
  }
}
