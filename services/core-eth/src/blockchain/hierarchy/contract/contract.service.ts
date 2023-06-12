import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

import { ArrayOverlap, In, DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { wallet } from "@gemunion/constants";
import { testChainId } from "@framework/constants";

import { ContractEntity } from "./contract.entity";
import { ContractFeatures, ModuleType, TokenType } from "@framework/types";
import { IContractListenerResult } from "../../../common/interfaces";

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    private readonly contractEntityRepository: Repository<ContractEntity>,
    private readonly configService: ConfigService,
  ) {}

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
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));
    const contractEntity = await this.findOne({ address: address.toLowerCase(), chainId });
    if (contractEntity) {
      return contractEntity.fromBlock;
    }
    return 0;
  }

  public async updateLastBlockByAddr(address: string, lastBlock: number): Promise<number> {
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const entity = await this.findOne({
      address,
      chainId,
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
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const entity = await this.findOne({
      contractModule,
      chainId,
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
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const entity = await this.findOne({
      contractType,
      contractModule: ModuleType.HIERARCHY,
      chainId,
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

  public async findAllByType(
    contractModule: ModuleType,
    contractFeatures?: Array<ContractFeatures>,
  ): Promise<IContractListenerResult> {
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));
    const where = { contractModule, chainId };

    if (contractFeatures) {
      if (contractFeatures.length) {
        Object.assign(where, {
          // https://github.com/typeorm/typeorm/blob/master/docs/find-options.md
          contractFeatures: ArrayOverlap(contractFeatures),
        });
      } else {
        Object.assign(where, {
          // https://github.com/typeorm/typeorm/blob/master/docs/find-options.md
          contractFeatures: In([]),
        });
      }
    }

    const contractEntities = await this.findAll(where);

    if (contractEntities.length) {
      return {
        address: contractEntities.map(contractEntity => contractEntity.address).filter(c => c !== wallet),
        fromBlock: Math.max(...contractEntities.map(contractEntity => contractEntity.fromBlock)),
      };
    }
    return { address: [], fromBlock: undefined };
  }

  public async findAllTokensByType(
    contractType?: TokenType,
    contractFeatures?: Array<ContractFeatures>,
  ): Promise<IContractListenerResult> {
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const queryBuilder = this.contractEntityRepository
      .createQueryBuilder("contract")
      .andWhere("contract.contractModule = :contractModule", { contractModule: ModuleType.HIERARCHY })
      .andWhere("contract.chainId = :chainId", { chainId })
      // it should be nested array
      .andWhere("contract.contractFeatures NOT IN (:...features)", { features: [[ContractFeatures.EXTERNAL]] });

    if (contractType) {
      queryBuilder.andWhere("contract.contractType = :contractType", { contractType });
    }

    // TODO fix search in array
    if (contractFeatures) {
      if (contractFeatures.length === 1) {
        queryBuilder.andWhere(":contractFeature = ANY(contract.contractFeatures)", {
          contractFeature: contractFeatures[0],
        });
      } else {
        queryBuilder.andWhere("contract.contractFeatures && :contractFeatures", { contractFeatures });
      }
    }

    const contractEntities = await queryBuilder.getMany();

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
