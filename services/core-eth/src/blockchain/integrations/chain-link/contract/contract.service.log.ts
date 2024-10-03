import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsNull, Not } from "typeorm";
import { keccak256, toBeHex, toUtf8Bytes, zeroPadValue } from "ethers";

import { ChainLinkEventSignature, ChainLinkType, ModuleType } from "@framework/types";
import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";

import { ContractService } from "../../../hierarchy/contract/contract.service";
import { ChainLinkSubscriptionService } from "../subscription/subscription.service";
import { VrfABI } from "./interfaces";

@Injectable()
export class ChainLinkContractServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
    private readonly chainLinkSubscriptionService: ChainLinkSubscriptionService,
  ) {}

  public async updateRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractModule: ModuleType.CHAIN_LINK,
      chainId,
    });

    const subscriptions = await this.chainLinkSubscriptionService.findAll({ chainId, vrfSubId: Not(IsNull()) });
    const subIds = subscriptions.map(sub => zeroPadValue(toBeHex(BigInt(sub.vrfSubId)), 32));
    const _topics = [
      [keccak256(toUtf8Bytes(ChainLinkEventSignature.RandomWordsRequested))],
      null,
      [...new Set(subIds)],
    ];

    return this.ethersService.updateRegistry({
      contractType: ChainLinkType.VRF,
      contractAddress: contractEntities.filter(c => c.address !== wallet).map(c => c.address),
      contractInterface: VrfABI,
      eventSignatures: [],
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
