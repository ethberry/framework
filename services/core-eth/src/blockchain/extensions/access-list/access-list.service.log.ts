import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { In } from "typeorm";

import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";
import { AccessListEventSignature, ContractFeatures } from "@framework/types";

import { ContractService } from "../../hierarchy/contract/contract.service";
import { AccessListABI } from "./interfaces";
import { ContractType } from "../../../utils/contract-type";

@Injectable()
export class AccessListServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async updateRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractFeatures: In([[ContractFeatures.BLACKLIST, ContractFeatures.WHITELIST]]),
      chainId,
    });

    this.ethersService.updateRegistry({
      contractType: ContractType.ACCESS_LIST,
      contractAddress: contractEntities.filter(c => c.address !== wallet).map(c => c.address),
      contractInterface: AccessListABI,
      eventSignatures: [
        AccessListEventSignature.Blacklisted,
        AccessListEventSignature.UnBlacklisted,
        AccessListEventSignature.Whitelisted,
        AccessListEventSignature.UnWhitelisted,
      ],
    });
  }

  public updateRegistryAndReadBlock(address: Array<string>, blockNumber: number): Promise<void> {
    return this.ethersService.updateRegistryAndReadBlock(
      {
        contractType: ContractType.ACCESS_LIST,
        contractAddress: address,
        contractInterface: AccessListABI,
        eventSignatures: [
          AccessListEventSignature.Blacklisted,
          AccessListEventSignature.UnBlacklisted,
          AccessListEventSignature.Whitelisted,
          AccessListEventSignature.UnWhitelisted,
        ],
      },
      blockNumber,
    );
  }
}
