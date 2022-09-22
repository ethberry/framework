import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";
import { providers } from "ethers";

import { ETHERS_RPC, ILogEvent } from "@gemunion/nestjs-ethers";

import {
  ContractEventType,
  IERC721TokenApprovedForAllEvent,
  IERC721TokenApproveEvent,
  TContractEventData,
} from "@framework/types";

import { TokenService } from "./token.service";
import { ContractHistoryService } from "../../contract-history/contract-history.service";
import { ContractService } from "../contract/contract.service";

@Injectable()
export class TokenServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: providers.JsonRpcProvider,
    protected readonly contractService: ContractService,
    protected readonly tokenService: TokenService,
    protected readonly contractHistoryService: ContractHistoryService,
  ) {}

  public async approval(event: ILogEvent<IERC721TokenApproveEvent>, context: Log): Promise<void> {
    const {
      args: { tokenId },
    } = event;

    const tokenEntity = await this.tokenService.getToken(tokenId, context.address.toLowerCase());

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, context, void 0, tokenEntity.id);
  }

  public async approvalForAll(event: ILogEvent<IERC721TokenApprovedForAllEvent>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async updateHistory(
    event: ILogEvent<TContractEventData>,
    context: Log,
    contractId?: number,
    tokenId?: number,
  ) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), TokenServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    if (!contractId) {
      const parentContractEntity = await this.contractService.findOne({ address: address.toLowerCase() });

      if (!parentContractEntity) {
        throw new NotFoundException("contractNotFound");
      }
      contractId = parentContractEntity.id;
    }

    await this.contractHistoryService.create({
      address: address.toLowerCase(),
      transactionHash: transactionHash.toLowerCase(),
      eventType: name as ContractEventType,
      eventData: args,
      // ApprovedForAll has no tokenId
      tokenId: tokenId || null,
      contractId,
    });

    await this.contractService.updateLastBlockByAddr(address.toLowerCase(), parseInt(blockNumber.toString(), 16));
  }
}
