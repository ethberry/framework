import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { In } from "typeorm";

import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";
import { RoyaltyEventSignature, TokenType } from "@framework/types";

import { ContractService } from "../../hierarchy/contract/contract.service";
import { RoyaltyABI } from "./interfaces";
import { ContractType } from "../../../utils/contract-type";

@Injectable()
export class RoyaltyServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async updateRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractType: In([TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155]),
      chainId,
    });

    this.ethersService.updateRegistry({
      contractType: ContractType.ROYALTY,
      contractAddress: contractEntities.filter(c => c.address !== wallet).map(c => c.address),
      contractInterface: RoyaltyABI,
      eventSignatures: [RoyaltyEventSignature.DefaultRoyaltyInfo, RoyaltyEventSignature.TokenRoyaltyInfo],
    });
  }

  public updateRegistryAndReadBlock(address: Array<string>, blockNumber: number): Promise<void> {
    return this.ethersService.updateRegistryAndReadBlock(
      {
        contractType: ContractType.ROYALTY,
        contractAddress: address,
        contractInterface: RoyaltyABI,
        eventSignatures: [RoyaltyEventSignature.DefaultRoyaltyInfo, RoyaltyEventSignature.TokenRoyaltyInfo],
      },
      blockNumber,
    );
  }
}
