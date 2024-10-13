import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { In } from "typeorm";

import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";
import { ChainLinkEventSignature, ContractFeatures } from "@framework/types";

import { ContractType } from "../../../../../utils/contract-type";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { ERC721RandomABI } from "./interfaces";

@Injectable()
export class ChainLinkConsumerServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async initRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractFeatures: In([[ContractFeatures.RANDOM, ContractFeatures.GENES]]),
      chainId,
    });

    this.updateRegistry(contractEntities.filter(c => c.address !== wallet).map(c => c.address));
  }

  public updateRegistry(address: Array<string>): void {
    this.ethersService.updateRegistry({
      contractType: ContractType.VRF_RANDOM,
      contractAddress: address,
      contractInterface: ERC721RandomABI,
      eventSignatures: [ChainLinkEventSignature.MintRandom, ChainLinkEventSignature.VrfSubscriptionSet],
    });
  }
}
