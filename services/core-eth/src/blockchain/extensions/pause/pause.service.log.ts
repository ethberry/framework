import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { In } from "typeorm";

import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";
import { ContractFeatures, PausableEventSignature } from "@framework/types";

import { ContractType } from "../../../utils/contract-type";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { PausableABI } from "./interfaces";

@Injectable()
export class PauseServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async initRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractFeatures: In([[ContractFeatures.PAUSABLE]]),
      chainId,
    });

    this.updateRegistry(contractEntities.filter(c => c.address !== wallet).map(c => c.address));
  }

  public updateRegistry(address: Array<string>): void {
    this.ethersService.updateRegistry({
      contractType: ContractType.PAUSE,
      contractAddress: address,
      contractInterface: PausableABI,
      eventSignatures: [PausableEventSignature.Paused, PausableEventSignature.Unpaused],
    });
  }
}