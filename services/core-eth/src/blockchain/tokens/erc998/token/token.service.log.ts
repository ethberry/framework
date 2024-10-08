import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { In, Not } from "typeorm";

import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";
import {
  AccessControlEventSignature,
  AccessListEventSignature,
  BaseUrlEventSignature,
  ChainLinkEventSignature,
  ContractFeatures,
  ContractType,
  DiscreteEventSignature,
  Erc4907EventSignature,
  Erc721EventSignature,
  Erc998EventSignature,
  ModuleType,
  PausableEventSignature,
  RoyaltyEventSignature,
  TokenType,
} from "@framework/types";

import { ContractService } from "../../../hierarchy/contract/contract.service";
import { Erc998ABI, Erc998ABIRandom } from "./interfaces";
import { Erc20ABI } from "../../erc20/token/interfaces";

@Injectable()
export class Erc998TokenServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async updateRegistrySimple(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractModule: ModuleType.HIERARCHY,
      contractType: TokenType.ERC998,
      contractFeatures: Not(In([[ContractFeatures.EXTERNAL, ContractFeatures.GENES, ContractFeatures.RANDOM]])),
      chainId,
    });

    this.ethersService.updateRegistry({
      contractType: ContractType.ERC998_TOKEN,
      contractAddress: contractEntities.filter(c => c.address !== wallet).map(c => c.address),
      contractInterface: Erc998ABI,
      eventSignatures: [
        Erc721EventSignature.Approval,
        Erc721EventSignature.ApprovalForAll,
        Erc721EventSignature.Transfer,
        Erc998EventSignature.BatchReceivedChild,
        Erc998EventSignature.BatchTransferChild,
        Erc998EventSignature.ReceivedChild,
        Erc998EventSignature.SetMaxChild,
        Erc998EventSignature.TransferChild,
        Erc998EventSignature.UnWhitelistedChild,
        Erc998EventSignature.WhitelistedChild,
        // mechanics
        Erc4907EventSignature.UpdateUser,
        DiscreteEventSignature.LevelUp,
        // extensions
        RoyaltyEventSignature.DefaultRoyaltyInfo,
        RoyaltyEventSignature.TokenRoyaltyInfo,
        BaseUrlEventSignature.BaseURIUpdate,
        PausableEventSignature.Paused,
        PausableEventSignature.Unpaused,
        AccessControlEventSignature.RoleGranted,
        AccessControlEventSignature.RoleRevoked,
        AccessControlEventSignature.RoleAdminChanged,
        AccessListEventSignature.Blacklisted,
        AccessListEventSignature.UnBlacklisted,
      ],
    });
  }

  public async updateRegistryRandom(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities2 = await this.contractService.findAll({
      contractModule: ModuleType.HIERARCHY,
      contractType: TokenType.ERC998,
      contractFeatures: In([[ContractFeatures.GENES, ContractFeatures.RANDOM]]),
      chainId,
    });

    this.ethersService.updateRegistry({
      contractType: ContractType.ERC998_TOKEN_RANDOM,
      contractAddress: contractEntities2.filter(c => c.address !== wallet).map(c => c.address),
      contractInterface: Erc998ABIRandom,
      eventSignatures: [
        Erc721EventSignature.Approval,
        Erc721EventSignature.ApprovalForAll,
        Erc721EventSignature.Transfer,
        Erc998EventSignature.BatchReceivedChild,
        Erc998EventSignature.BatchTransferChild,
        Erc998EventSignature.ReceivedChild,
        Erc998EventSignature.SetMaxChild,
        Erc998EventSignature.TransferChild,
        Erc998EventSignature.UnWhitelistedChild,
        Erc998EventSignature.WhitelistedChild,
        // mechanics
        Erc4907EventSignature.UpdateUser,
        DiscreteEventSignature.LevelUp,
        // integrations
        ChainLinkEventSignature.VrfSubscriptionSet,
        Erc721EventSignature.MintRandom,
        // extensions
        RoyaltyEventSignature.DefaultRoyaltyInfo,
        RoyaltyEventSignature.TokenRoyaltyInfo,
        BaseUrlEventSignature.BaseURIUpdate,
        PausableEventSignature.Paused,
        PausableEventSignature.Unpaused,
        AccessControlEventSignature.RoleGranted,
        AccessControlEventSignature.RoleRevoked,
        AccessControlEventSignature.RoleAdminChanged,
        AccessListEventSignature.Blacklisted,
        AccessListEventSignature.UnBlacklisted,
      ],
    });
  }

  public updateRegistryAndReadBlockSimple(address: Array<string>, blockNumber: number): Promise<void> {
    return this.ethersService.updateRegistryAndReadBlock(
      {
        contractType: ContractType.ERC998_TOKEN,
        contractAddress: address,
        contractInterface: Erc20ABI,
        eventSignatures: [
          Erc721EventSignature.Approval,
          Erc721EventSignature.ApprovalForAll,
          Erc721EventSignature.Transfer,
          Erc998EventSignature.BatchReceivedChild,
          Erc998EventSignature.BatchTransferChild,
          Erc998EventSignature.ReceivedChild,
          Erc998EventSignature.SetMaxChild,
          Erc998EventSignature.TransferChild,
          Erc998EventSignature.UnWhitelistedChild,
          Erc998EventSignature.WhitelistedChild,
          // mechanics
          Erc4907EventSignature.UpdateUser,
          DiscreteEventSignature.LevelUp,
          // extensions
          RoyaltyEventSignature.DefaultRoyaltyInfo,
          RoyaltyEventSignature.TokenRoyaltyInfo,
          BaseUrlEventSignature.BaseURIUpdate,
          PausableEventSignature.Paused,
          PausableEventSignature.Unpaused,
          AccessControlEventSignature.RoleGranted,
          AccessControlEventSignature.RoleRevoked,
          AccessControlEventSignature.RoleAdminChanged,
          AccessListEventSignature.Blacklisted,
          AccessListEventSignature.UnBlacklisted,
        ],
      },
      blockNumber,
    );
  }

  public updateRegistryAndReadBlockRandom(address: Array<string>, blockNumber: number): Promise<void> {
    return this.ethersService.updateRegistryAndReadBlock(
      {
        contractType: ContractType.ERC998_TOKEN_RANDOM,
        contractAddress: address,
        contractInterface: Erc20ABI,
        eventSignatures: [
          Erc721EventSignature.Approval,
          Erc721EventSignature.ApprovalForAll,
          Erc721EventSignature.Transfer,
          Erc721EventSignature.ConsecutiveTransfer,
          Erc998EventSignature.BatchReceivedChild,
          Erc998EventSignature.BatchTransferChild,
          Erc998EventSignature.ReceivedChild,
          Erc998EventSignature.SetMaxChild,
          Erc998EventSignature.TransferChild,
          Erc998EventSignature.UnWhitelistedChild,
          Erc998EventSignature.WhitelistedChild,
          // mechanics
          Erc4907EventSignature.UpdateUser,
          DiscreteEventSignature.LevelUp,
          // integrations
          ChainLinkEventSignature.VrfSubscriptionSet,
          Erc721EventSignature.MintRandom,
          // extensions
          RoyaltyEventSignature.DefaultRoyaltyInfo,
          RoyaltyEventSignature.TokenRoyaltyInfo,
          BaseUrlEventSignature.BaseURIUpdate,
          PausableEventSignature.Paused,
          PausableEventSignature.Unpaused,
          AccessControlEventSignature.RoleGranted,
          AccessControlEventSignature.RoleRevoked,
          AccessControlEventSignature.RoleAdminChanged,
          AccessListEventSignature.Blacklisted,
          AccessListEventSignature.UnBlacklisted,
        ],
      },
      blockNumber,
    );
  }
}
