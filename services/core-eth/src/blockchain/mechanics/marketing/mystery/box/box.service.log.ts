import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import {
  AccessControlEventSignature,
  BaseUrlEventSignature,
  ContractType,
  Erc721EventSignature,
  ModuleType,
  MysteryEventSignature,
  RoyaltyEventSignature,
  TokenType,
} from "@framework/types";
import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";

import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { MysteryABI } from "./interfaces";

@Injectable()
export class MysteryBoxServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async updateRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractModule: ModuleType.MYSTERY,
      contractType: TokenType.ERC721,
      chainId,
    });

    return this.ethersService.updateRegistry({
      contractType: ContractType.MYSTERY,
      contractAddress: contractEntities.filter(c => c.address !== wallet).map(c => c.address),
      contractInterface: MysteryABI,
      eventSignatures: [
        Erc721EventSignature.Approval,
        Erc721EventSignature.ApprovalForAll,
        Erc721EventSignature.Transfer,
        MysteryEventSignature.UnpackMysteryBox,
        // extensions
        BaseUrlEventSignature.BaseURIUpdate,
        RoyaltyEventSignature.DefaultRoyaltyInfo,
        RoyaltyEventSignature.TokenRoyaltyInfo,
        AccessControlEventSignature.RoleGranted,
        AccessControlEventSignature.RoleRevoked,
        AccessControlEventSignature.RoleAdminChanged,
      ],
    });
  }

  public updateRegistryAndReadBlock(address: Array<string>, blockNumber: number): Promise<void> {
    return this.ethersService.updateRegistryAndReadBlock(
      {
        contractType: ContractType.MYSTERY,
        contractAddress: address,
        contractInterface: MysteryABI,
        eventSignatures: [
          Erc721EventSignature.Approval,
          Erc721EventSignature.ApprovalForAll,
          Erc721EventSignature.Transfer,
          MysteryEventSignature.UnpackMysteryBox,
          // extensions
          RoyaltyEventSignature.DefaultRoyaltyInfo,
          RoyaltyEventSignature.TokenRoyaltyInfo,
          BaseUrlEventSignature.BaseURIUpdate,
          AccessControlEventSignature.RoleGranted,
          AccessControlEventSignature.RoleRevoked,
          AccessControlEventSignature.RoleAdminChanged,
        ],
      },
      blockNumber,
    );
  }
}
