import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";
import { ChainLinkEventSignature, ContractFeatures } from "@framework/types";

import { ContractType } from "../../../../utils/contract-type";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { ERC721RandomABI } from "./interfaces";

@Injectable()
export class ChainLinkConsumerServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async updateRegistrySimple(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractFeatures: ContractFeatures.RANDOM,
      chainId,
    });

    this.ethersService.updateRegistry({
      contractType: ContractType.RANDOM,
      contractAddress: contractEntities.filter(c => c.address !== wallet).map(c => c.address),
      contractInterface: ERC721RandomABI,
      eventSignatures: [ChainLinkEventSignature.MintRandom, ChainLinkEventSignature.VrfSubscriptionSet],
    });
  }

  public updateRegistryAndReadBlockSimple(address: Array<string>, blockNumber: number): Promise<void> {
    return this.ethersService.updateRegistryAndReadBlock(
      {
        contractType: ContractType.RANDOM,
        contractAddress: address,
        contractInterface: ERC721RandomABI,
        eventSignatures: [ChainLinkEventSignature.MintRandom, ChainLinkEventSignature.VrfSubscriptionSet],
      },
      blockNumber,
    );
  }
}
