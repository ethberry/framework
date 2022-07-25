import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { constants } from "ethers";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractEventType,
  IErc1155TokenApprovalForAll,
  IErc1155TokenTransferBatch,
  IErc1155TokenTransferSingle,
  IErc1155TokenUri,
  TContractEventData,
} from "@framework/types";

import { ContractHistoryService } from "../../blockchain/contract-history/contract-history.service";
import { ContractManagerService } from "../../blockchain/contract-manager/contract-manager.service";
import { TokenService } from "../../blockchain/hierarchy/token/token.service";
import { BalanceService } from "../../blockchain/hierarchy/balance/balance.service";

@Injectable()
export class Erc1155TokenServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly contractManagerService: ContractManagerService,
    private readonly contractHistoryService: ContractHistoryService,
    private readonly balanceService: BalanceService,
    private readonly tokenService: TokenService,
  ) {}

  public async transferSingle(event: ILogEvent<IErc1155TokenTransferSingle>, context: Log): Promise<void> {
    const {
      args: { from, to, id, value },
    } = event;

    await this.updateHistory(event, context);

    await this.updateBalances(from.toLowerCase(), to.toLowerCase(), context.address.toLowerCase(), id, value);
  }

  public async transferBatch(event: ILogEvent<IErc1155TokenTransferBatch>, context: Log): Promise<void> {
    const {
      args: { from, to, ids, values },
    } = event;

    await this.updateHistory(event, context);

    await Promise.all(
      ids.map((tokenId: string, i: number) =>
        this.updateBalances(
          from.toLowerCase(),
          to.toLowerCase(),
          context.address.toLowerCase(),
          tokenId.toString(),
          values[i],
        ),
      ),
    );
  }

  public async approvalForAll(event: ILogEvent<IErc1155TokenApprovalForAll>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async uri(event: ILogEvent<IErc1155TokenUri>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  private async updateBalances(from: string, to: string, address: string, tokenId: string, amount: string) {
    const erc1155TokenEntity = await this.tokenService.getToken(tokenId, address);

    if (!erc1155TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    if (from !== constants.AddressZero) {
      erc1155TokenEntity.template.amount += ~~amount;
      await this.balanceService.decrement(erc1155TokenEntity.id, from, amount);
    }

    if (to !== constants.AddressZero) {
      // erc1155TokenEntity.instanceCount -= ~~amount;
      await this.balanceService.increment(erc1155TokenEntity.id, to, amount);
    }
  }

  private async updateHistory(event: ILogEvent<TContractEventData>, context: Log) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), Erc1155TokenServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.contractHistoryService.create({
      address: address.toLowerCase(),
      transactionHash: transactionHash.toLowerCase(),
      eventType: name as ContractEventType,
      eventData: args,
    });

    await this.contractManagerService.updateLastBlockByAddr(
      context.address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
