import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import {
  ArrayOverlap,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
  Repository,
  UpdateResult,
} from "typeorm";

import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";
import { ContractFeatures, ModuleType, TokenType } from "@framework/types";

import type { IContractListenerResult, ISystemContractListenerResult } from "../../../common/interfaces";
import { ContractEntity } from "./contract.entity";

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
    options?: FindManyOptions<ContractEntity>,
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

  public async updateParameter(
    where: FindOptionsWhere<ContractEntity>,
    key: string,
    value: string | number | boolean,
  ): Promise<UpdateResult> {
    const queryBuilder = this.contractEntityRepository.createQueryBuilder("contract").update();
    queryBuilder.set({
      parameters: () => `jsonb_set(parameters::jsonb, '{${key}}', '"${value}"', true)`,
    });
    queryBuilder.where(where);
    return queryBuilder.execute();
  }

  // TODO throw not found error?
  public async getMerchantWalletByContract(address: string): Promise<string | null> {
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));
    const contractEntity = await this.findOne(
      { address: address.toLowerCase(), chainId },
      { relations: { merchant: true } },
    );
    if (contractEntity) {
      return contractEntity.merchant.wallet;
    }
    return null;
  }

  public async getLastBlock(address: string): Promise<number | null> {
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));
    const contractEntity = await this.findOne({ address: address.toLowerCase(), chainId });
    if (contractEntity) {
      return contractEntity.fromBlock;
    }
    return 0;
  }

  public async updateLastBlockById(id: number, lastBlock: number): Promise<void> {
    await this.contractEntityRepository.update({ id }, { fromBlock: lastBlock + 1 });
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

  public async updateLastBlockByTokenTypeModuleType(
    contractModule: ModuleType,
    contractType: TokenType,
    lastBlock: number,
  ): Promise<number> {
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const entity = await this.findOne({
      contractType,
      contractModule,
      chainId,
    });

    if (entity) {
      await this.updateLastBlockById(entity.id, lastBlock);
      return lastBlock + 1;
    }
    return lastBlock;
  }

  public async updateLastBlockByTokenTypeRandom(contractType: TokenType, lastBlock: number): Promise<number> {
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const contractEntity = await this.findOne({
      contractType,
      contractModule: ModuleType.HIERARCHY,
      contractFeatures: ArrayOverlap([ContractFeatures.RANDOM, ContractFeatures.GENES]),
      chainId,
    });

    if (contractEntity) {
      await this.update(
        {
          id: contractEntity.id,
        },
        { fromBlock: lastBlock + 1 },
      );
      return contractEntity.fromBlock;
    }
    return lastBlock;
  }

  public async updateLastBlockByModuleTypeRandom(contractModule: ModuleType, lastBlock: number): Promise<number> {
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const entity = await this.findOne({
      contractModule,
      contractFeatures: ArrayOverlap([ContractFeatures.RANDOM, ContractFeatures.GENES]),
      chainId,
    });

    if (entity) {
      await this.updateLastBlockById(entity.id, lastBlock);
      return lastBlock + 1;
    }
    return lastBlock;
  }

  public async findSystemByName(where: FindOptionsWhere<ContractEntity>): Promise<ISystemContractListenerResult> {
    const contractEntity = await this.findOne(where);

    // system must exist
    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    return {
      address: contractEntity.address !== wallet ? [contractEntity.address] : [],
      fromBlock: contractEntity.fromBlock,
    };
  }

  public async findAllByType(
    contractModule: Array<ModuleType>,
    contractFeatures?: Array<ContractFeatures>,
  ): Promise<IContractListenerResult> {
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));
    const where = { contractModule: In(contractModule), chainId };

    if (contractFeatures) {
      if (contractFeatures.length) {
        Object.assign(where, {
          // https://github.com/typeorm/typeorm/blob/master/docs/find-options.md
          contractFeatures: ArrayOverlap(contractFeatures),
        });
      } else {
        Object.assign(where, {
          contractFeatures: [],
        });
      }
    }
    const contractEntities = await this.findAll(where);

    if (contractEntities.length) {
      const unique = [
        ...new Set(contractEntities.map(contractEntity => contractEntity.address).filter(c => c !== wallet)),
      ];

      return {
        address: unique,
        fromBlock: Math.max(...contractEntities.map(contractEntity => contractEntity.fromBlock)),
      };
    }
    return {
      address: [],
    };
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
      .andWhere("NOT (contract.contractFeatures && :features)", { features: [ContractFeatures.EXTERNAL] });

    if (contractType) {
      queryBuilder.andWhere("contract.contractType = :contractType", { contractType });
    }

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
    return { address: [] };
  }

  public async findAllRandomTokensByType(
    contractType?: TokenType,
    contractFeatures?: Array<ContractFeatures>,
  ): Promise<IContractListenerResult> {
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const queryBuilder = this.contractEntityRepository
      .createQueryBuilder("contract")
      .andWhere("contract.contractModule = :contractModule", { contractModule: ModuleType.HIERARCHY })
      .andWhere("contract.chainId = :chainId", { chainId })
      .andWhere("NOT (contract.contractFeatures && :features)", { features: [ContractFeatures.EXTERNAL] });

    if (contractType) {
      queryBuilder.andWhere("contract.contractType = :contractType", { contractType });
    }

    if (contractFeatures) {
      queryBuilder.andWhere("contract.contractFeatures && :contractFeatures", {
        contractFeatures,
      });
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
    return { address: [] };
  }

  public async findAllCommonTokensByType(
    contractType?: TokenType,
    contractFeatures?: Array<ContractFeatures>,
  ): Promise<IContractListenerResult> {
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const queryBuilder = this.contractEntityRepository
      .createQueryBuilder("contract")
      .andWhere("contract.contractModule = :contractModule", { contractModule: ModuleType.HIERARCHY })
      .andWhere("contract.chainId = :chainId", { chainId })
      .andWhere("NOT (contract.contractFeatures && :features)", {
        features: [ContractFeatures.EXTERNAL, ContractFeatures.RANDOM, ContractFeatures.GENES],
      });

    if (contractType) {
      queryBuilder.andWhere("contract.contractType = :contractType", { contractType });
    }

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
    return { address: [] };
  }
}
