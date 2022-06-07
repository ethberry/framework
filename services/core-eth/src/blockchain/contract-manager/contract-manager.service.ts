import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ContractType } from "@framework/types";
import { ContractManagerEntity } from "./contract-manager.entity";
import { IContractManagerResult } from "./interfaces";

@Injectable()
export class ContractManagerService {
  constructor(
    @InjectRepository(ContractManagerEntity)
    private readonly contractManagerEntityRepository: Repository<ContractManagerEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<ContractManagerEntity>,
    options?: FindOneOptions<ContractManagerEntity>,
  ): Promise<ContractManagerEntity | null> {
    return this.contractManagerEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<ContractManagerEntity>,
    options?: FindOneOptions<ContractManagerEntity>,
  ): Promise<Array<ContractManagerEntity>> {
    return this.contractManagerEntityRepository.find({ where, ...options });
  }

  public async create(dto: DeepPartial<ContractManagerEntity>): Promise<ContractManagerEntity | null> {
    const { address, fromBlock, contractType } = dto;

    const contractManagerEntity = await this.contractManagerEntityRepository
      .create({ address, fromBlock, contractType })
      .save();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return contractManagerEntity || null;
  }

  public async delete(where: FindOptionsWhere<ContractManagerEntity>): Promise<DeleteResult> {
    return this.contractManagerEntityRepository.delete(where);
  }

  public async update(
    where: FindOptionsWhere<ContractManagerEntity>,
    dto: DeepPartial<ContractManagerEntity>,
  ): Promise<ContractManagerEntity> {
    const contractManagerEntity = await this.findOne(where);

    if (!contractManagerEntity) {
      throw new NotFoundException("entityNotFound");
    }

    Object.assign(contractManagerEntity, dto);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return contractManagerEntity.save();
  }

  public async getLastBlock(address: string): Promise<number | null> {
    const contractManagerEntity = await this.findOne({ address: address.toLowerCase() });
    if (contractManagerEntity) {
      return contractManagerEntity.fromBlock;
    }
    return 0;
  }

  public async findAllByType(contractType: ContractType): Promise<IContractManagerResult> {
    const contractManagerEntities = await this.findAll({ contractType });
    if (contractManagerEntities.length) {
      return {
        address: contractManagerEntities.map(contractManagerEntity => contractManagerEntity.address),
        fromBlock: Math.max(...contractManagerEntities.map(contractManagerEntity => contractManagerEntity.fromBlock)),
      };
    }
    return { address: [], fromBlock: undefined };
  }

  public async updateLastBlockByType(contractType: ContractType, lastBlock: number): Promise<number> {
    const entity = await this.findOne({
      contractType,
    });

    if (entity) {
      await this.update(
        {
          id: entity.id,
        },
        { fromBlock: lastBlock + 1 },
      );
      return entity.fromBlock;
    }
    return lastBlock;
  }
}
