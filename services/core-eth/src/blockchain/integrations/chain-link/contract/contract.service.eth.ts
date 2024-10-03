import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JsonRpcProvider, Log, Wallet } from "ethers";

import { ETHERS_RPC, ETHERS_SIGNER, ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import { IVrfRandomWordsRequestedEvent, ModuleType } from "@framework/types";
import { testChainId } from "@framework/constants";

import { ContractService } from "../../../hierarchy/contract/contract.service";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { callRandom } from "./utils";

@Injectable()
export class ChainLinkContractServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: JsonRpcProvider,
    @Inject(ETHERS_SIGNER)
    protected readonly ethersSignerProvider: Wallet,
    protected readonly configService: ConfigService,
    protected readonly contractService: ContractService,
    protected readonly eventHistoryService: EventHistoryService,
  ) {}

  public async randomRequest(event: ILogEvent<IVrfRandomWordsRequestedEvent>, context: Log): Promise<void> {
    const {
      args: { requestId, sender, subId, callbackGasLimit, numWords, extraArgs, keyHash },
    } = event;

    await this.eventHistoryService.updateHistory(event, context);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    // DEV ONLY
    // !!!should work only on Gemunion's BESUs!!!
    if (chainId !== 10001 && chainId !== 10000) {
      return;
    }

    const vrfCoordinator = await this.contractService.findSystemByName({
      contractModule: ModuleType.CHAIN_LINK,
      chainId,
    });

    const txr: string = await callRandom(
      vrfCoordinator.address[0],
      {
        requestId,
        sender,
        subId,
        callbackGasLimit,
        numWords,
        keyHash,
        extraArgs,
      },
      this.ethersSignerProvider,
    );
    this.loggerService.log(JSON.stringify(`callRandom ${txr}`, null, "\t"), ChainLinkContractServiceEth.name);
  }
}
