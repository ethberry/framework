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
  ModuleType,
  PausableEventSignature,
  RaffleEventType,
} from "@framework/types";
import { testChainId } from "@framework/constants";

import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { RaffleABI } from "./interfaces";

@Injectable()
export class RaffleRoundServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async updateRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractModule: ModuleType.RAFFLE,
      contractType: IsNull(),
      chainId,
    });

    return this.ethersService.updateRegistry({
      contractType: ContractType.RAFFLE,
      contractAddress: contractEntities.filter(c => c.address !== wallet).map(c => c.address),
      contractInterface: RaffleABI,
      eventSignatures: [
        RaffleEventType.Prize,
        RaffleEventType.RoundEnded,
        RaffleEventType.Released,
        RaffleEventType.RoundStarted,
        RaffleEventType.RoundFinalized,
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
        contractType: ContractType.RAFFLE,
        contractAddress: address,
        contractInterface: RaffleABI,
        eventSignatures: [
          RaffleEventType.Prize,
          RaffleEventType.RoundEnded,
          RaffleEventType.Released,
          RaffleEventType.RoundStarted,
          RaffleEventType.RoundFinalized,
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