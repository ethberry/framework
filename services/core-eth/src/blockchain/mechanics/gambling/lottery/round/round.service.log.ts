import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsNull } from "typeorm";

import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import {
  AccessControlEventType,
  ChainLinkEventSignature,
  ContractType,
  Erc1363EventSignature,
  LotteryEventType,
  ModuleType,
  PausableEventSignature,
} from "@framework/types";
import { testChainId } from "@framework/constants";

import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { LotteryABI } from "./interfaces";

@Injectable()
export class LotteryRoundServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async updateRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractModule: ModuleType.LOTTERY,
      contractType: IsNull(),
      chainId,
    });

    return this.ethersService.updateRegistry({
      contractType: ContractType.LOTTERY,
      contractAddress: contractEntities.filter(c => c.address !== wallet).map(c => c.address),
      contractInterface: LotteryABI,
      eventSignatures: [
        LotteryEventType.Prize,
        LotteryEventType.RoundEnded,
        LotteryEventType.Released,
        LotteryEventType.RoundStarted,
        LotteryEventType.RoundFinalized,
        Erc1363EventSignature.TransferReceived,
        // integrations
        ChainLinkEventSignature.VrfSubscriptionSet,
        // extensions
        PausableEventSignature.Paused,
        PausableEventSignature.Unpaused,
        AccessControlEventType.RoleAdminChanged,
        AccessControlEventType.RoleGranted,
        AccessControlEventType.RoleRevoked,
      ],
    });
  }

  public updateRegistryAndReadBlock(address: Array<string>, blockNumber: number): Promise<void> {
    return this.ethersService.updateRegistryAndReadBlock(
      {
        contractType: ContractType.LOTTERY,
        contractAddress: address,
        contractInterface: LotteryABI,
        eventSignatures: [
          LotteryEventType.Prize,
          LotteryEventType.RoundEnded,
          LotteryEventType.Released,
          LotteryEventType.RoundStarted,
          LotteryEventType.RoundFinalized,
          Erc1363EventSignature.TransferReceived,
          // integrations
          ChainLinkEventSignature.VrfSubscriptionSet,
          // extensions
          PausableEventSignature.Paused,
          PausableEventSignature.Unpaused,
          AccessControlEventType.RoleAdminChanged,
          AccessControlEventType.RoleGranted,
          AccessControlEventType.RoleRevoked,
        ],
      },
      blockNumber,
    );
  }
}
