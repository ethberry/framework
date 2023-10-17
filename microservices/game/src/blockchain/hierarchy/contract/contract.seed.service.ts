import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { wallets } from "@gemunion/constants";
import { ContractFeatures, ContractStatus, ModuleType, TokenType } from "@framework/types";

import { generateTestContract, generateTestMerchant, generateTestUser } from "../../../test";
import { UserEntity } from "../../../infrastructure/user/user.entity";
import { MerchantEntity } from "../../../infrastructure/merchant/merchant.entity";
import { ContractEntity } from "./contract.entity";

@Injectable()
export class ContractSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
    @InjectRepository(MerchantEntity)
    private readonly merchantEntityRepository: Repository<MerchantEntity>,
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

    const merchant2 = await this.merchantEntityRepository
      .create(
        generateTestMerchant({
          wallet: wallets[1],
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
          merchant: merchant1,
          contractFeatures: [ContractFeatures.EXTERNAL],
          contractModule: ModuleType.MYSTERY,
        }),
      )
      .save();

    const contract2 = await this.contractEntityRepository
      .create(
        generateTestContract({
          merchant: merchant2,
        }),
      )
      .save();

    const contract3 = await this.contractEntityRepository
      .create(
        generateTestContract({
          merchant: merchant1,
          contractStatus: ContractStatus.NEW,
        }),
      )
      .save();

    const contract4 = await this.contractEntityRepository
      .create(
        generateTestContract({
          merchant: merchant1,
          contractStatus: ContractStatus.INACTIVE,
        }),
      )
      .save();

    const contract5 = await this.contractEntityRepository
      .create(
        generateTestContract({
          merchant: merchant1,
          contractType: TokenType.ERC20,
          contractFeatures: [ContractFeatures.EXTERNAL],
          chainId: 1,
        }),
      )
      .save();

    const contract6 = await this.contractEntityRepository
      .create(
        generateTestContract({
          merchant: merchant1,
          contractType: TokenType.ERC721,
          contractModule: ModuleType.MYSTERY,
          chainId: 1,
        }),
      )
      .save();

    return {
      users: [user1],
      merchants: [merchant1, merchant2],
      contracts: [contract1, contract2, contract3, contract4, contract5, contract6],
    };
  }

  public async tearDown(): Promise<void> {
    await this.userEntityRepository.delete({});
    await this.contractEntityRepository.delete({});
    await this.merchantEntityRepository.delete({});
  }
}
