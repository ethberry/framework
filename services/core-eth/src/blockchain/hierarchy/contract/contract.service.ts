import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from "typeorm";

import { testChainId } from "@framework/constants";

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
    where: FindOptionsWhere<ContractEntity> | Array<FindOptionsWhere<ContractEntity>>,
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
}
