import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { constants } from "ethers";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  Erc20TokenEventType,
  IErc20TokenApprove,
  IErc20TokenSnapshot,
  IErc20TokenTransfer,
  TErc20TokenEventData,
} from "@framework/types";

import { Erc20ContractHistoryService } from "./contract-history/contract-history.service";
import { ContractManagerService } from "../../blockchain/contract-manager/contract-manager.service";
import { BalanceService } from "../../blockchain/hierarchy/balance/balance.service";
import { TokenService } from "../../blockchain/hierarchy/token/token.service";
import { ContractService } from "../../blockchain/hierarchy/contract/contract.service";

@Injectable()
export class Erc20TokenServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly erc20ContractHistoryService: Erc20ContractHistoryService,
    private readonly contractManagerService: ContractManagerService,
    private readonly tokenService: TokenService,
    private readonly balanceService: BalanceService,
    private readonly contractService: ContractService,
  ) {}

  public async transfer(event: ILogEvent<IErc20TokenTransfer>, context: Log): Promise<void> {
    const { args } = event;
    const { from, to, value } = args;
    const { address } = context;

    await this.updateHistory(event, context);

    const tokenEntity = await this.tokenService.getToken("0", address.toLowerCase());

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    if (from === constants.AddressZero) {
      await this.balanceService.increment(tokenEntity.id, to.toLowerCase(), value);
    } else if (to === constants.AddressZero) {
      await this.balanceService.decrement(tokenEntity.id, to.toLowerCase(), value);
    } else {
      await this.balanceService.increment(tokenEntity.id, to.toLowerCase(), value);
      await this.balanceService.decrement(tokenEntity.id, from.toLowerCase(), value);
    }
  }

  public async approval(event: ILogEvent<IErc20TokenApprove>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async snapshot(event: ILogEvent<IErc20TokenSnapshot>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  private async updateHistory(event: ILogEvent<TErc20TokenEventData>, context: Log) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), Erc20TokenServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.erc20ContractHistoryService.create({
      address,
      transactionHash,
      eventType: name as Erc20TokenEventType,
      eventData: args,
    });

    await this.contractManagerService.updateLastBlockByAddr(
      context.address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
