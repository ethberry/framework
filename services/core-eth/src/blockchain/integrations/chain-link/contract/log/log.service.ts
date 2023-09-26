import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { toBeHex, zeroPadValue } from "ethers";

import { EthersContractService } from "@gemunion/nest-js-module-ethers-gcp";

import { testChainId } from "@framework/constants";
import { ModuleType } from "@framework/types";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { ChainLinkSubscriptionService } from "../../subscription/subscription.service";

import { ChainLinkEventSignatures } from "../../interfaces";
import { keccak256It } from "../utils";

@Injectable()
export class ChainLinkLogService {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    private readonly ethersContractService: EthersContractService,
    private readonly contractService: ContractService,
    private readonly chainLinkSubscriptionService: ChainLinkSubscriptionService,
    private readonly configService: ConfigService,
  ) {}

  public async updateListener(): Promise<void> {
    const subscriptions = await this.getAllSubscriptions();
    if (subscriptions) {
      const topics = [
        [keccak256It(ChainLinkEventSignatures.RandomWordsRequested as string)],
        null,
        [...new Set(subscriptions)],
      ];
      this.ethersContractService.updateListener([], 0, topics);
      this.loggerService.log(`VRF_SUB Listener updated: ${JSON.stringify(topics)}`, ChainLinkLogService.name);
    }
  }

  public async updateBlock(): Promise<void> {
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));
    const vrfCoordinator = await this.contractService.findSystemByName({
      contractModule: ModuleType.CHAIN_LINK,
      chainId,
    });

    await this.contractService.updateLastBlockByAddr(
      vrfCoordinator.address[0],
      this.ethersContractService.getLastBlockOption(),
    );
  }

  public async getAllSubscriptions(): Promise<string[] | undefined> {
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));
    const subscriptions = await this.chainLinkSubscriptionService.findAll({ chainId });
    const subIds = subscriptions.map(sub => zeroPadValue(toBeHex(sub.vrfSubId), 32));
    return [...new Set(subIds)];
  }
}
