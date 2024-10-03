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
  ModuleType,
  MysteryEventSignature,
  PausableEventSignature,
  RoyaltyEventSignature,
  TokenType,
} from "@framework/types";

import { ContractService } from "../../../hierarchy/contract/contract.service";
import { Erc721ABI, Erc721ABIRandom } from "./interfaces";
import { Erc20ABI } from "../../erc20/token/interfaces";

@Injectable()
export class Erc721TokenServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async updateRegistrySimple(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractModule: ModuleType.HIERARCHY,
      contractType: TokenType.ERC721,
      contractFeatures: Not(In([[ContractFeatures.EXTERNAL, ContractFeatures.GENES, ContractFeatures.RANDOM]])),
      chainId,
    });

    this.ethersService.updateRegistry({
      contractType: ContractType.ERC721_TOKEN,
      contractAddress: contractEntities.filter(c => c.address !== wallet).map(c => c.address),
      contractInterface: Erc721ABI,
      eventSignatures: [
        Erc721EventSignature.Approval,
        Erc721EventSignature.ApprovalForAll,
        Erc721EventSignature.Transfer,
        Erc721EventSignature.ConsecutiveTransfer,
        // mechanics
        MysteryEventSignature.UnpackMysteryBox,
        DiscreteEventSignature.LevelUp,
        Erc4907EventSignature.UpdateUser,
        // extensions
        RoyaltyEventSignature.DefaultRoyaltyInfo,
        RoyaltyEventSignature.TokenRoyaltyInfo,
        PausableEventSignature.Paused,
        PausableEventSignature.Unpaused,
        BaseUrlEventSignature.BaseURIUpdate,
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
      contractType: TokenType.ERC721,
      contractFeatures: In([[ContractFeatures.GENES, ContractFeatures.RANDOM]]),
      chainId,
    });

    this.ethersService.updateRegistry({
      contractType: ContractType.ERC721_TOKEN_RANDOM,
      contractAddress: contractEntities2.filter(c => c.address !== wallet).map(c => c.address),
      contractInterface: Erc721ABIRandom,
      eventSignatures: [
        Erc721EventSignature.Approval,
        Erc721EventSignature.ApprovalForAll,
        Erc721EventSignature.Transfer,
        Erc721EventSignature.MintRandom,
        // integrations
        ChainLinkEventSignature.VrfSubscriptionSet,
        // extensions
        RoyaltyEventSignature.DefaultRoyaltyInfo,
        RoyaltyEventSignature.TokenRoyaltyInfo,
        PausableEventSignature.Paused,
        PausableEventSignature.Unpaused,
        DiscreteEventSignature.LevelUp,
        BaseUrlEventSignature.BaseURIUpdate,
        AccessControlEventSignature.RoleGranted,
        AccessControlEventSignature.RoleRevoked,
        AccessControlEventSignature.RoleAdminChanged,
        Erc4907EventSignature.UpdateUser,
        AccessListEventSignature.Blacklisted,
        AccessListEventSignature.UnBlacklisted,
      ],
    });
  }

  public updateRegistryAndReadBlockSimple(address: Array<string>, blockNumber: number): Promise<void> {
    return this.ethersService.updateRegistryAndReadBlock(
      {
        contractType: ContractType.ERC721_TOKEN,
        contractAddress: address,
        contractInterface: Erc20ABI,
        eventSignatures: [
          Erc721EventSignature.Approval,
          Erc721EventSignature.ApprovalForAll,
          Erc721EventSignature.Transfer,
          // mechanics
          DiscreteEventSignature.LevelUp,
          Erc4907EventSignature.UpdateUser,
          MysteryEventSignature.UnpackMysteryBox,
          Erc721EventSignature.ConsecutiveTransfer,
          // extensions
          RoyaltyEventSignature.DefaultRoyaltyInfo,
          RoyaltyEventSignature.TokenRoyaltyInfo,
          PausableEventSignature.Paused,
          PausableEventSignature.Unpaused,
          BaseUrlEventSignature.BaseURIUpdate,
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
        contractType: ContractType.ERC721_TOKEN_RANDOM,
        contractAddress: address,
        contractInterface: Erc20ABI,
        eventSignatures: [
          Erc721EventSignature.Approval,
          Erc721EventSignature.ApprovalForAll,
          Erc721EventSignature.Transfer,
          // integrations
          Erc721EventSignature.MintRandom,
          ChainLinkEventSignature.VrfSubscriptionSet,
          // mechanics
          DiscreteEventSignature.LevelUp,
          Erc4907EventSignature.UpdateUser,
          // extensions
          RoyaltyEventSignature.DefaultRoyaltyInfo,
          RoyaltyEventSignature.TokenRoyaltyInfo,
          PausableEventSignature.Paused,
          PausableEventSignature.Unpaused,
          BaseUrlEventSignature.BaseURIUpdate,
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
