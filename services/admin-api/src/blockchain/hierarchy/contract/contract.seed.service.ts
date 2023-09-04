import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ContractFeatures, ContractStatus, ModuleType, TokenType } from "@framework/types";

import { ContractEntity } from "./contract.entity";
import { UserEntity } from "../../../infrastructure/user/user.entity";
import { generateTestContract, generateTestUser } from "../../../../../../code/test";

@Injectable()
export class ContractSeedService {
  constructor(
    @InjectRepository(ContractEntity)
    private readonly contractEntityRepository: Repository<ContractEntity>,
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
  ) {}

  public async setup(): Promise<any> {
    const user1 = await this.userEntityRepository.create(generateTestUser()).save();
    const contract1 = await this.contractEntityRepository
      .create(
        generateTestContract({
          contractFeatures: [ContractFeatures.BLACKLIST, ContractFeatures.DISCRETE, ContractFeatures.RANDOM],
          contractType: TokenType.ERC721,
          contractStatus: ContractStatus.ACTIVE,
          contractModule: ModuleType.HIERARCHY,
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
          chainId: 0,
        }),
      )
      .save();

    return {
      users: [user1],
      contracts: [contract1, contract2, contract3, contract4, contract5],
    };
  }

  public async tearDown(): Promise<void> {
    await this.userEntityRepository.delete({});
    await this.contractEntityRepository.delete({});
  }
}
