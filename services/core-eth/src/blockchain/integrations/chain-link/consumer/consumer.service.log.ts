import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ArrayOverlap, IsNull } from "typeorm";

import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";
import { ChainLinkEventSignature, ContractFeatures, ModuleType } from "@framework/types";

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

  public async initRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll([
      {
        contractModule: ModuleType.HIERARCHY,
        contractFeatures: ArrayOverlap([[ContractFeatures.RANDOM, ContractFeatures.GENES, ContractFeatures.TRAITS]]),
        chainId,
      },
      {
        contractModule: ModuleType.LOOT,
        chainId,
      },
      {
        contractModule: ModuleType.LOTTERY,
        contractType: IsNull(),
        chainId,
      },
      {
        contractModule: ModuleType.HIERARCHY,
        contractFeatures: IsNull(),
        chainId,
      },
    ]);

    this.updateRegistry(contractEntities.filter(c => c.address !== wallet).map(c => c.address));
  }

  public updateRegistry(address: Array<string>): void {
    this.ethersService.updateRegistry({
      contractType: ContractType.VRF_CONSUMER,
      contractAddress: address,
      contractInterface: ERC721RandomABI,
      eventSignatures: [ChainLinkEventSignature.VrfSubscriptionSet],
    });
  }
}
