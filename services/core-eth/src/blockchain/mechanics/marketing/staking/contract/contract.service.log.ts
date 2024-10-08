import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsNull } from "typeorm";

import {
  AccessControlEventSignature,
  ContractType,
  ModuleType,
  PausableEventSignature,
  ReferralProgramEventSignature,
  StakingEventSignature,
} from "@framework/types";
import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";

import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { StakingABI } from "./interfaces";

@Injectable()
export class StakingContractServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async updateRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractModule: ModuleType.STAKING,
      contractType: IsNull(),
      chainId,
    });

    return this.ethersService.updateRegistry({
      contractType: ContractType.STAKING,
      contractAddress: contractEntities.filter(c => c.address !== wallet).map(c => c.address),
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
        // MODULE:REFERRAL
        ReferralProgramEventSignature.ReferralEvent,
        // extensions
        PausableEventSignature.Paused,
        PausableEventSignature.Unpaused,
        AccessControlEventSignature.RoleGranted,
        AccessControlEventSignature.RoleRevoked,
        AccessControlEventSignature.RoleAdminChanged,
      ],
    });
  }

  public updateRegistryAndReadBlock(address: Array<string>, blockNumber: number): Promise<void> {
    return this.ethersService.updateRegistryAndReadBlock(
      {
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
          // MODULE:REFERRAL
          ReferralProgramEventSignature.ReferralEvent,
          // extensions
          PausableEventSignature.Paused,
          PausableEventSignature.Unpaused,
          AccessControlEventSignature.RoleGranted,
          AccessControlEventSignature.RoleRevoked,
          AccessControlEventSignature.RoleAdminChanged,
        ],
      },
      blockNumber,
    );
  }
}
