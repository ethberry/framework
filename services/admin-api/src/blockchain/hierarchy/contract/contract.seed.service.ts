import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { wallets } from "@ethberry/constants";
import { ContractFeatures, ContractStatus, ModuleType, TokenType } from "@framework/types";

import { ContractEntity } from "./contract.entity";
import { UserEntity } from "../../../infrastructure/user/user.entity";
import { generateTestContract, generateTestMerchant, generateTestUser } from "../../../test";
import { MerchantEntity } from "../../../infrastructure/merchant/merchant.entity";

@Injectable()
export class ContractSeedService {
  constructor(
    @InjectRepository(MerchantEntity)
    private readonly merchantEntityRepository: Repository<MerchantEntity>,
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
    @InjectRepository(ContractEntity)
    private readonly contractEntityRepository: Repository<ContractEntity>,
  ) {}

  public async setup(): Promise<any> {
    const merchant1 = await this.merchantEntityRepository
      .create(
        generateTestMerchant({
          wallet: wallets[0],
        }),
      )
      .save();

    const user1 = await this.userEntityRepository
      .create(
        generateTestUser({
          merchant: merchant1,
        }),
      )
      .save();

    const contract1 = await this.contractEntityRepository
      .create(
        generateTestContract({
          contractFeatures: [ContractFeatures.BLACKLIST, ContractFeatures.DISCRETE, ContractFeatures.RANDOM],
          contractType: TokenType.ERC721,
          contractStatus: ContractStatus.ACTIVE,
          contractModule: ModuleType.HIERARCHY,
          merchant: merchant1,
        }),
      )
      .save();
    const contract2 = await this.contractEntityRepository
      .create(
        generateTestContract({
          contractFeatures: [ContractFeatures.BLACKLIST, ContractFeatures.PAUSABLE],
          contractType: TokenType.ERC721,
          contractStatus: ContractStatus.INACTIVE,
          contractModule: ModuleType.MYSTERY,
          merchant: merchant1,
        }),
      )
      .save();
    const contract3 = await this.contractEntityRepository
      .create(
        generateTestContract({
          contractFeatures: [ContractFeatures.GENES, ContractFeatures.DISCRETE, ContractFeatures.RANDOM],
          contractType: TokenType.ERC20,
          contractStatus: ContractStatus.NEW,
          contractModule: ModuleType.LOTTERY,
          merchant: merchant1,
        }),
      )
      .save();
    const contract4 = await this.contractEntityRepository
      .create(
        generateTestContract({
          contractFeatures: [ContractFeatures.GENES],
          contractType: TokenType.ERC20,
          contractStatus: ContractStatus.ACTIVE,
          contractModule: ModuleType.HIERARCHY,
          merchant: merchant1,
        }),
      )
      .save();
    const contract5 = await this.contractEntityRepository
      .create(
        generateTestContract({
          contractFeatures: [ContractFeatures.BLACKLIST],
          contractType: TokenType.ERC20,
          contractStatus: ContractStatus.ACTIVE,
          contractModule: ModuleType.MYSTERY,
          merchant: merchant1,
          chainId: 0,
        }),
      )
      .save();

    return {
      merchants: [merchant1],
      users: [user1],
      contracts: [contract1, contract2, contract3, contract4, contract5],
    };
  }

  public async tearDown(): Promise<void> {
    await this.merchantEntityRepository.delete({});
    await this.userEntityRepository.delete({});
    await this.contractEntityRepository.delete({});
  }
}
