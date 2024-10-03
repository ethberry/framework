import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsNull } from "typeorm";

import {
  AccessControlEventSignature,
  ContractType,
  ModuleType,
  PausableEventSignature,
  WaitListEventType,
} from "@framework/types";
import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";

import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { WaitListABI } from "./interfaces";

@Injectable()
export class WaitListListServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async updateRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractModule: ModuleType.WAIT_LIST,
      contractType: IsNull(),
      chainId,
    });

    return this.ethersService.updateRegistry({
      contractType: ContractType.WAIT_LIST,
      contractAddress: contractEntities.filter(c => c.address !== wallet).map(c => c.address),
      contractInterface: WaitListABI,
      eventSignatures: [
        WaitListEventType.WaitListRewardSet,
        WaitListEventType.WaitListRewardClaimed,
        // extensions
        PausableEventSignature.Paused,
        PausableEventSignature.Unpaused,
        AccessControlEventSignature.RoleAdminChanged,
        AccessControlEventSignature.RoleGranted,
        AccessControlEventSignature.RoleRevoked,
      ],
    });
  }

  public updateRegistryAndReadBlock(address: Array<string>, blockNumber: number): Promise<void> {
    return this.ethersService.updateRegistryAndReadBlock(
      {
        contractType: ContractType.WAIT_LIST,
        contractAddress: address,
        contractInterface: WaitListABI,
        eventSignatures: [
          WaitListEventType.WaitListRewardSet,
          WaitListEventType.WaitListRewardClaimed,
          // extensions
          PausableEventSignature.Paused,
          PausableEventSignature.Unpaused,
          AccessControlEventSignature.RoleAdminChanged,
          AccessControlEventSignature.RoleGranted,
          AccessControlEventSignature.RoleRevoked,
        ],
      },
      blockNumber,
    );
  }
}
