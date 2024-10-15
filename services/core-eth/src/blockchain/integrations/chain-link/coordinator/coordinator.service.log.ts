import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { ChainLinkEventSignature, ModuleType } from "@framework/types";
import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";

import { ContractType } from "../../../../utils/contract-type";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { VrfABI } from "./interfaces";

@Injectable()
export class ChainLinkCoordinatorServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async initRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractModule: ModuleType.CHAIN_LINK,
      chainId,
    });

    return this.updateRegistry(contractEntities.filter(c => c.address !== wallet).map(c => c.address));
  }

  public updateRegistry(address: Array<string>): void {
    this.ethersService.updateRegistry({
      contractType: ContractType.VRF,
      contractAddress: address,
      contractInterface: VrfABI,
      eventSignatures: [ChainLinkEventSignature.RandomWordsRequested],
    });
  }
}
