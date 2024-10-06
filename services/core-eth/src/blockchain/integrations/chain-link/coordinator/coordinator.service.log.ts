import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { ChainLinkEventSignature, ChainLinkType, ModuleType } from "@framework/types";
import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";

import { ContractService } from "../../../hierarchy/contract/contract.service";
import { VrfABI } from "./interfaces";

@Injectable()
export class ChainLinkCoordinatorServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async updateRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractModule: ModuleType.CHAIN_LINK,
      chainId,
    });

    return this.ethersService.updateRegistry({
      contractType: ChainLinkType.VRF,
      contractAddress: contractEntities.filter(c => c.address !== wallet).map(c => c.address),
      contractInterface: VrfABI,
      eventSignatures: [ChainLinkEventSignature.RandomWordsRequested],
    });
  }

  public updateRegistryAndReadBlock(address: Array<string>, blockNumber: number): Promise<void> {
    return this.ethersService.updateRegistryAndReadBlock(
      {
        contractType: ChainLinkType.VRF,
        contractAddress: address,
        contractInterface: VrfABI,
        eventSignatures: [],
      },
      blockNumber,
    );
  }
}
