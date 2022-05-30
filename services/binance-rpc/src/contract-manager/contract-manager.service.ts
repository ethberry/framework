import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IContractManagerSearchDto, ContractType } from "@framework/types";

import { IContractManagerCreateDto, IContractManagerResult } from "./interfaces";
import { ContractManagerEntity } from "./contract-manager.entity";

@Injectable()
export class ContractManagerService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    @InjectRepository(ContractManagerEntity)
    private readonly contractManagerEntityRepository: Repository<ContractManagerEntity>,
  ) {}

  public async search(dto: Partial<IContractManagerSearchDto>): Promise<[Array<ContractManagerEntity>, number]> {
    const { skip, take, query, contractType } = dto;

    const queryBuilder = this.contractManagerEntityRepository.createQueryBuilder("system");

    queryBuilder.select();

    if (query) {
      queryBuilder.andWhere("system.address ILIKE '%' || :address || '%'", { address: query });
    }

    if (contractType) {
      if (contractType.length === 1) {
        queryBuilder.andWhere("system.contractType = :contractType", {
          contractType: contractType[0],
        });
      } else {
        queryBuilder.andWhere("system.contractType IN(:...contractType)", { contractType });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "system.id": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

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

  public async create(dto: IContractManagerCreateDto): Promise<ContractManagerEntity | null> {
    const { address, fromBlock, contractType } = dto;

    const contractManagerEntity = await this.contractManagerEntityRepository
      .create({ address, fromBlock, contractType })
      .save();

    return contractManagerEntity;
  }

  public async delete(where: FindOptionsWhere<ContractManagerEntity>): Promise<DeleteResult> {
    return this.contractManagerEntityRepository.delete(where);
  }

  public async update(
    where: FindOptionsWhere<ContractManagerEntity>,
    dto: Partial<IContractManagerCreateDto>,
  ): Promise<ContractManagerEntity> {
    const contractManagerEntity = await this.findOne(where);

    if (!contractManagerEntity) {
      throw new NotFoundException("entityNotFound");
    }

    Object.assign(contractManagerEntity, dto);
    return contractManagerEntity.save();
  }

  public async getLastBlock(address: string): Promise<number | null> {
    const contractManagerEntity = await this.findOne({ address });

    if (contractManagerEntity) {
      return contractManagerEntity.fromBlock;
    }
    return 0;
  }

  public async findAllByType(contractType: ContractType): Promise<IContractManagerResult> {
    const contractManagerEntities = await this.findAll({ contractType });

    if (contractManagerEntities) {
      return {
        address: contractManagerEntities.map(contractManagerEntity => contractManagerEntity.address),
        fromBlock: Math.min(...contractManagerEntities.map(contractManagerEntity => contractManagerEntity.fromBlock)),
      };
    }
    return { address: [] };
  }
}
