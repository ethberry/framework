import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { constants, providers } from "ethers";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ETHERS_RPC } from "@gemunion/nestjs-ethers";

import {
  IErc1155TokenApprovalForAllEvent,
  IErc1155TokenTransferBatchEvent,
  IErc1155TokenTransferSingleEvent,
  IErc1155TokenUriEvent,
} from "@framework/types";

import { ContractHistoryService } from "../../../contract-history/contract-history.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { TokenServiceEth } from "../../../hierarchy/token/token.service.eth";

@Injectable()
export class Erc1155TokenServiceEth extends TokenServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: providers.JsonRpcProvider,
    protected readonly contractService: ContractService,
    protected readonly contractHistoryService: ContractHistoryService,
    protected readonly balanceService: BalanceService,
    protected readonly tokenService: TokenService,
  ) {
    super(loggerService, jsonRpcProvider, contractService, tokenService, contractHistoryService);
  }

  public async transferSingle(event: ILogEvent<IErc1155TokenTransferSingleEvent>, context: Log): Promise<void> {
    const {
      args: { from, to, id /* 1155 db:tokenId */, value },
    } = event;
    const { address } = context;

    const tokenEntity = await this.tokenService.getToken(id, address);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }
    await this.updateHistory(event, context, void 0, tokenEntity.id);
    await this.updateBalances(from.toLowerCase(), to.toLowerCase(), address.toLowerCase(), tokenEntity.tokenId, value);
  }

  public async transferBatch(event: ILogEvent<IErc1155TokenTransferBatchEvent>, context: Log): Promise<void> {
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

  public async approvalForAllErc1155(event: ILogEvent<IErc1155TokenApprovalForAllEvent>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async uri(event: ILogEvent<IErc1155TokenUriEvent>, context: Log): Promise<void> {
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
}
