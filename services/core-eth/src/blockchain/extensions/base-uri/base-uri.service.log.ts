import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";
import { BaseUrlEventSignature, TokenType } from "@framework/types";

import { ContractType } from "../../../utils/contract-type";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { BaseUrlABI } from "./interfaces";

@Injectable()
export class BaseUriServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async updateRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractType: TokenType.ERC721,
      chainId,
    });

    this.ethersService.updateRegistry({
      contractType: ContractType.BASE_URL,
      contractAddress: contractEntities.filter(c => c.address !== wallet).map(c => c.address),
      contractInterface: BaseUrlABI,
      eventSignatures: [BaseUrlEventSignature.BaseURIUpdate],
    });
  }

  public updateRegistryAndReadBlock(address: Array<string>, blockNumber: number): Promise<void> {
    return this.ethersService.updateRegistryAndReadBlock(
      {
        contractType: ContractType.BASE_URL,
        contractAddress: address,
        contractInterface: BaseUrlABI,
        eventSignatures: [BaseUrlEventSignature.BaseURIUpdate],
      },
      blockNumber,
    );
  }
}
