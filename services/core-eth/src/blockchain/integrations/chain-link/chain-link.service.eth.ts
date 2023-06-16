import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JsonRpcProvider, Wallet } from "ethers";
import { Log } from "ethers";
import { ETHERS_RPC, ETHERS_SIGNER, ILogEvent } from "@gemunion/nestjs-ethers";

import { callRandom } from "./utils";
import { IChainLinkRandomWordsRequestedEvent } from "./log/interfaces";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { EventHistoryService } from "../../event-history/event-history.service";

@Injectable()
export class ChainLinkServiceEth {
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

    const vrfAddr = this.configService.get<string>("VRF_ADDR", "");
    const txr: string = await callRandom(
      vrfAddr,
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
    this.loggerService.log(JSON.stringify(`callRandom ${txr}`, null, "\t"), ChainLinkServiceEth.name);
  }
}
