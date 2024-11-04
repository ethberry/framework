import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ArrayOverlap } from "typeorm";

import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";
import { AccessListEventSignature, ContractFeatures } from "@framework/types";

import { ContractType } from "../../../utils/contract-type";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { AccessListABI } from "./interfaces";

@Injectable()
export class AccessListServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async initRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractFeatures: ArrayOverlap([[ContractFeatures.BLACKLIST, ContractFeatures.WHITELIST]]),
      chainId,
    });

    this.updateRegistry(contractEntities.filter(c => c.address !== wallet).map(c => c.address));
  }

  public updateRegistry(address: Array<string>): void {
    this.ethersService.updateRegistry({
      contractType: ContractType.ACCESS_LIST,
      contractAddress: address,
      contractInterface: AccessListABI,
      eventSignatures: [
        AccessListEventSignature.Blacklisted,
        AccessListEventSignature.UnBlacklisted,
        AccessListEventSignature.Whitelisted,
        AccessListEventSignature.UnWhitelisted,
      ],
    });
  }
}