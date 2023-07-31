import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JsonRpcProvider, Log, Wallet } from "ethers";
import { ETHERS_RPC, ETHERS_SIGNER, ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";

import { ContractService } from "../../../hierarchy/contract/contract.service";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { IChainLinkRandomWordsRequestedEvent } from "./log/interfaces";
import { callRandom } from "./utils";

@Injectable()
export class ChainLinkContractServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: JsonRpcProvider,
    @Inject(ETHERS_SIGNER)
    protected readonly ethersSignerProviderAws: Wallet,
    protected readonly configService: ConfigService,
    protected readonly contractService: ContractService,
    protected readonly eventHistoryService: EventHistoryService,
  ) {}

  public async randomRequest(event: ILogEvent<IChainLinkRandomWordsRequestedEvent>, context: Log): Promise<void> {
    const {
      args: { requestId, sender, subId, callbackGasLimit, numWords, keyHash },
    } = event;

    await this.eventHistoryService.updateHistory(event, context);

    // DEV ONLY
    // !!!should work while on Gemunion's BESU!!!
    // const nodeEnv = this.configService.get<string>("NODE_ENV", "development");
    // if (nodeEnv === "production") {
    //   return;
    // }

    const vrfCoordinator = await this.contractService.findSystemByName("ChainLink VRF");
    const txr: string = await callRandom(
      vrfCoordinator.address[0],
      {
        requestId,
        sender,
        subId,
        callbackGasLimit,
        numWords,
        keyHash,
      },
      this.ethersSignerProviderAws,
    );
    this.loggerService.log(JSON.stringify(`callRandom ${txr}`, null, "\t"), ChainLinkContractServiceEth.name);
  }
}
