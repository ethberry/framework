import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { providers, Wallet } from "ethers";
import { Log } from "@ethersproject/abstract-provider";
import { ETHERS_RPC, ETHERS_SIGNER, ILogEvent } from "@gemunion/nestjs-ethers";

import { callRandom } from "./utils";
import { IChainLinkRandomRequestEvent } from "./log/interfaces";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { TokenServiceEth } from "../../hierarchy/token/token.service.eth";

@Injectable()
export class ChainLinkServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: providers.JsonRpcProvider,
    @Inject(ETHERS_SIGNER)
    protected readonly ethersSignerProviderAws: Wallet,
    protected readonly configService: ConfigService,
    protected readonly contractService: ContractService,
    protected readonly tokenServiceEth: TokenServiceEth,
  ) {}

  public async randomRequest(event: ILogEvent<IChainLinkRandomRequestEvent>, context: Log): Promise<void> {
    const {
      args: { _requestID, _sender },
    } = event;
    const { address, blockNumber } = context;
    await this.tokenServiceEth.updateHistory(event, context);
    await this.contractService.updateLastBlockByAddr(address.toLowerCase(), parseInt(blockNumber.toString(), 16));

    // DEV ONLY
    // !!!should work while on Gemunion's BESU!!!
    // const nodeEnv = this.configService.get<string>("NODE_ENV", "development");
    // if (nodeEnv === "production") {
    //   return;
    // }

    const vrfAddr = this.configService.get<string>("VRF_ADDR", "");
    const txr: string = await callRandom(vrfAddr, _sender, _requestID, this.ethersSignerProviderAws);
    this.loggerService.log(JSON.stringify(`callRandom ${txr}`, null, "\t"), ChainLinkServiceEth.name);
  }
}
