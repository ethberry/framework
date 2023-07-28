import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log, ZeroAddress } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";

import {
  IErc1155TokenApprovalForAllEvent,
  IErc1155TokenTransferBatchEvent,
  IErc1155TokenTransferSingleEvent,
  IErc1155TokenUriEvent,
} from "@framework/types";

import { TokenService } from "../../../hierarchy/token/token.service";
import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { TokenServiceEth } from "../../../hierarchy/token/token.service.eth";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { NotificatorService } from "../../../../game/notificator/notificator.service";

@Injectable()
export class Erc1155TokenServiceEth extends TokenServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    protected readonly eventHistoryService: EventHistoryService,
    protected readonly balanceService: BalanceService,
    protected readonly tokenService: TokenService,
    protected readonly notificatorService: NotificatorService,
  ) {
    super(loggerService, tokenService, eventHistoryService);
  }

  public async transferSingle(event: ILogEvent<IErc1155TokenTransferSingleEvent>, context: Log): Promise<void> {
    const {
      args: { from, to, id /* 1155 db:tokenId */, value },
    } = event;
    const { address } = context;

    const tokenEntity = await this.tokenService.getToken(Number(id).toString(), address);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }
    await this.eventHistoryService.updateHistory(event, context, tokenEntity.id);
    await this.updateBalances(from.toLowerCase(), to.toLowerCase(), address.toLowerCase(), tokenEntity.tokenId, value);

    await this.notificatorService.tokenTransfer({
      token: tokenEntity,
      from: from.toLowerCase(),
      to: to.toLowerCase(),
      amount: value, // TODO separate notifications for native\erc20\erc721\erc998\erc1155 ?
    });
  }

  public async transferBatch(event: ILogEvent<IErc1155TokenTransferBatchEvent>, context: Log): Promise<void> {
    const {
      args: { from, to, ids /* 1155 db:tokenIds */, values },
    } = event;
    const { address } = context;

    await this.eventHistoryService.updateHistory(event, context);

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

    // TODO simplify notification?
    const tokensEntities = await this.tokenService.getBatch(ids, address);

    if (!tokensEntities) {
      throw new NotFoundException("tokensNotFound");
    }

    await this.notificatorService.batchTransfer({
      tokens: tokensEntities,
      from: from.toLowerCase(),
      to: to.toLowerCase(),
      amounts: values, // TODO separate notifications for native\erc20\erc721\erc998\erc1155 ?
    });
  }

  public async approvalForAllErc1155(event: ILogEvent<IErc1155TokenApprovalForAllEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }

  public async uri(event: ILogEvent<IErc1155TokenUriEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }

  private async updateBalances(from: string, to: string, address: string, tokenId: string, amount: string) {
    const erc1155TokenEntity = await this.tokenService.getToken(tokenId, address);

    if (!erc1155TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    if (from !== ZeroAddress) {
      erc1155TokenEntity.template.amount += Number(amount);
      await this.balanceService.decrement(erc1155TokenEntity.id, from, amount);
    }

    if (to !== ZeroAddress) {
      // erc1155TokenEntity.instanceCount -= ~~amount;
      await this.balanceService.increment(erc1155TokenEntity.id, to, amount);
    }
  }
}
