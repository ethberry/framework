import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import { ETHERS_RPC, ILogEvent } from "@gemunion/nestjs-ethers";

import { ContractEventType, ITokenApprove, ITokenApprovedForAll, TContractEventData } from "@framework/types";

import { TokenService } from "./token.service";
import { ContractHistoryService } from "../../contract-history/contract-history.service";
import { ContractService } from "../contract/contract.service";

@Injectable()
export class TokenServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(ETHERS_RPC)
    protected readonly contractService: ContractService,
    protected readonly tokenService: TokenService,
    protected readonly contractHistoryService: ContractHistoryService,
  ) {}

  public async approval(event: ILogEvent<ITokenApprove>, context: Log): Promise<void> {
    const {
      args: { tokenId },
    } = event;

    const tokenEntity = await this.tokenService.getToken(tokenId, context.address.toLowerCase());

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, context, tokenEntity.id);
  }

  public async approvalForAll(event: ILogEvent<ITokenApprovedForAll>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  protected async updateHistory(event: ILogEvent<TContractEventData>, context: Log, tokenId?: number) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), TokenServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.contractHistoryService.create({
      address: address.toLowerCase(),
      transactionHash: transactionHash.toLowerCase(),
      eventType: name as ContractEventType,
      eventData: args,
      // ApprovedForAll has no tokenId
      tokenId: tokenId || null,
    });

    await this.contractService.updateLastBlockByAddr(
      address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
