import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { wallet } from "@gemunion/constants";

import { ContractEntity } from "./contract.entity";
import { ContractFeatures, ContractType, ModuleType, TokenType } from "@framework/types";
import { IContractListenerResult } from "../../../common/interfaces";

@Injectable()
export class ContractService {
  public chainId: number;

  constructor(
    @InjectRepository(ContractEntity)
    private readonly contractEntityRepository: Repository<ContractEntity>,
    private readonly configService: ConfigService,
  ) {
    this.chainId = ~~configService.get<string>("CHAIN_ID", "1337");
  }

  public findOne(
    where: FindOptionsWhere<ContractEntity>,
    options?: FindOneOptions<ContractEntity>,
  ): Promise<ContractEntity | null> {
    return this.contractEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<ContractEntity>,
    options?: FindOneOptions<ContractEntity>,
  ): Promise<Array<ContractEntity>> {
    return this.contractEntityRepository.find({ where, ...options });
  }

  public async create(dto: DeepPartial<ContractEntity>): Promise<ContractEntity> {
    return this.contractEntityRepository.create(dto).save();
  }

  public async update(
    where: FindOptionsWhere<ContractEntity>,
    dto: DeepPartial<ContractEntity>,
  ): Promise<ContractEntity> {
    const contractEntity = await this.findOne(where);

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    Object.assign(contractEntity, dto);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return contractEntity.save();
  }

  public async getLastBlock(address: string): Promise<number | null> {
    const contractEntity = await this.findOne({ address: address.toLowerCase(), chainId: this.chainId });
    if (contractEntity) {
      return contractEntity.fromBlock;
    }
    return 0;
  }

  public async updateLastBlockByAddr(address: string, lastBlock: number): Promise<number> {
    const entity = await this.findOne({
      address,
      chainId: this.chainId,
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
    // todo throw error?
  }

  public async updateLastBlockByType(contractModule: ModuleType, lastBlock: number): Promise<number> {
    const entity = await this.findOne({
      contractModule,
      chainId: this.chainId,
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

  public async updateLastBlockByTokenType(contractType: TokenType, lastBlock: number): Promise<number> {
    const entity = await this.findOne({
      contractType,
      contractModule: ModuleType.HIERARCHY,
      chainId: this.chainId,
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

  public async findAllByType(contractModule: ModuleType): Promise<IContractListenerResult> {
    const contractEntities = await this.findAll({ contractModule, chainId: this.chainId });

    if (contractEntities.length) {
      return {
        address: contractEntities.map(contractEntity => contractEntity.address).filter(c => c !== wallet),
        fromBlock: Math.max(...contractEntities.map(contractEntity => contractEntity.fromBlock)),
      };
    }
    return { address: [], fromBlock: undefined };
  }

  public async findAllTokensByType(contractType: TokenType): Promise<IContractListenerResult> {
    const contractEntities = await this.contractEntityRepository
      .createQueryBuilder("contract")
      .andWhere("contract.contractType = :contractType", { contractType })
      .andWhere("contract.contractModule = :contractModule", { contractModule: ModuleType.HIERARCHY })
      .andWhere("contract.chainId = :chainId", { chainId: this.chainId })
      .andWhere("contract.contractFeatures NOT IN (:...features)", { features: [[ContractFeatures.EXTERNAL]] })
      .getMany();

    if (contractEntities.length) {
      const addresses = contractEntities.map(contractEntity => contractEntity.address).filter(c => c !== wallet);
      const unique = [...new Set(addresses)];
      return {
        address: unique,
        fromBlock: Math.max(...contractEntities.map(contractEntity => contractEntity.fromBlock)),
      };
    }
    return { address: [], fromBlock: undefined };
  }
}
