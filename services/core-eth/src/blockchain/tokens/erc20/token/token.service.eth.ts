import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { constants } from "ethers";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractEventType,
  IErc20TokenApproveEvent,
  IErc20TokenSnapshotEvent,
  IErc20TokenTransferEvent,
  TContractEventData,
} from "@framework/types";

import { ContractHistoryService } from "../../../hierarchy/contract/history/history.service";
import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class Erc20TokenServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly contractHistoryService: ContractHistoryService,
    private readonly contractService: ContractService,
    private readonly tokenService: TokenService,
    private readonly balanceService: BalanceService,
  ) {}

  public async transfer(event: ILogEvent<IErc20TokenTransferEvent>, context: Log): Promise<void> {
    await this.updateHistory(event, context);

    const { args } = event;
    const { from, to, value } = args;
    const { address } = context;

    const tokenEntity = await this.tokenService.getToken("0", address.toLowerCase());

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    if (from === constants.AddressZero) {
      await this.balanceService.increment(tokenEntity.id, to.toLowerCase(), value);
    } else if (to === constants.AddressZero) {
      await this.balanceService.decrement(tokenEntity.id, to.toLowerCase(), value);
    } else {
      if (value !== "0") {
        await this.balanceService.increment(tokenEntity.id, to.toLowerCase(), value);
        await this.balanceService.decrement(tokenEntity.id, from.toLowerCase(), value);
      }
    }
  }

  public async approval(event: ILogEvent<IErc20TokenApproveEvent>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async snapshot(event: ILogEvent<IErc20TokenSnapshotEvent>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  private async updateHistory(event: ILogEvent<TContractEventData>, context: Log) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), Erc20TokenServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.contractHistoryService.create({
      address,
      transactionHash,
      eventType: name as ContractEventType,
      eventData: args,
    });

    await this.contractService.updateLastBlockByAddr(address.toLowerCase(), parseInt(blockNumber.toString(), 16));
  }
}
