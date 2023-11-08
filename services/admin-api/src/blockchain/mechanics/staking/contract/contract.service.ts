import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import type { IContractSearchDto } from "@framework/types";
import { ModuleType } from "@framework/types";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { IStakingDepositBalanceCheck, StakingDepositService } from "../deposit/deposit.service";

@Injectable()
export class StakingContractService extends ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    protected readonly contractEntityRepository: Repository<ContractEntity>,
    protected readonly stakingDepositService: StakingDepositService,
    protected readonly configService: ConfigService,
  ) {
    super(contractEntityRepository, configService);
  }

  public search(dto: Partial<IContractSearchDto>, userEntity: UserEntity): Promise<[Array<ContractEntity>, number]> {
    return super.search(dto, userEntity, [ModuleType.STAKING], null);
  }

  public async checkBalance(id: number): Promise<Array<IStakingDepositBalanceCheck | null>> {
    const stakingContract = await super.findOne({ id });

    if (!stakingContract) {
      throw new NotFoundException("stakingContractNotFound");
    }

    return this.stakingDepositService.checkStakingDepositBalance(stakingContract.id, stakingContract.address);
  }
}
