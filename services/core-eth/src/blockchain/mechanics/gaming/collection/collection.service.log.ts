import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";
import { CollectionEventSignature, ModuleType, TokenType } from "@framework/types";

import { ContractType } from "../../../../utils/contract-type";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { ERC721CollectionABI } from "./interfaces";

@Injectable()
export class CollectionServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async updateRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractModule: ModuleType.COLLECTION,
      contractType: TokenType.ERC721,
      chainId,
    });

    this.ethersService.updateRegistry({
      contractType: ContractType.COLLECTION,
      contractAddress: contractEntities.filter(c => c.address !== wallet).map(c => c.address),
      contractInterface: ERC721CollectionABI,
      eventSignatures: [CollectionEventSignature.ConsecutiveTransfer],
    });
  }

  public updateRegistryAndReadBlock(address: Array<string>, blockNumber: number): Promise<void> {
    return this.ethersService.updateRegistryAndReadBlock(
      {
        contractType: ContractType.COLLECTION,
        contractAddress: address,
        contractInterface: ERC721CollectionABI,
        eventSignatures: [CollectionEventSignature.ConsecutiveTransfer],
      },
      blockNumber,
    );
  }
}
