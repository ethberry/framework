import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsNull } from "typeorm";

import { ModuleType, StakingEventSignature } from "@framework/types";
import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";

import { ContractType } from "../../../../../utils/contract-type";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { StakingABI } from "./interfaces";

@Injectable()
export class StakingContractServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async initRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractModule: ModuleType.STAKING,
      contractType: IsNull(),
      chainId,
    });

    return this.updateRegistry(contractEntities.filter(c => c.address !== wallet).map(c => c.address));
  }

  public updateRegistry(address: Array<string>): void {
    this.ethersService.updateRegistry({
      contractType: ContractType.STAKING,
      contractAddress: address,
      contractInterface: StakingABI,
      eventSignatures: [
        StakingEventSignature.RuleCreated,
        StakingEventSignature.RuleUpdated,
        StakingEventSignature.BalanceWithdraw,
        StakingEventSignature.DepositStart,
        StakingEventSignature.DepositWithdraw,
        StakingEventSignature.DepositFinish,
        StakingEventSignature.DepositReturn,
        StakingEventSignature.DepositPenalty,
      ],
    });
  }
}
