import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Log, ZeroAddress } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";

import type {
  IErc1155TokenApprovalForAllEvent,
  IErc1155TokenTransferBatchEvent,
  IErc1155TokenTransferSingleEvent,
  IErc1155TokenUriEvent,
} from "@framework/types";
import { RmqProviderType, SignalEventType } from "@framework/types";

import { TokenService } from "../../../hierarchy/token/token.service";
import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { TokenServiceEth } from "../../../hierarchy/token/token.service.eth";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { NotificatorService } from "../../../../game/notificator/notificator.service";
import { AssetService } from "../../../exchange/asset/asset.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class Erc1155TokenServiceEth extends TokenServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    private readonly signalClientProxy: ClientProxy,
    protected readonly eventHistoryService: EventHistoryService,
    protected readonly balanceService: BalanceService,
    protected readonly tokenService: TokenService,
    protected readonly contractService: ContractService,
    protected readonly assetService: AssetService,
    protected readonly notificatorService: NotificatorService,
  ) {
    super(loggerService, tokenService, eventHistoryService);
  }

  public async transferSingle(event: ILogEvent<IErc1155TokenTransferSingleEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { from, to, id /* 1155 db:tokenId */, value },
    } = event;
    const { address, transactionHash } = context;

    const tokenEntity = await this.tokenService.getToken(Number(id).toString(), address);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }
    await this.eventHistoryService.updateHistory(event, context, tokenEntity.id);
    await this.assetService.updateAssetHistory(transactionHash, tokenEntity);

    await this.updateBalances(from.toLowerCase(), to.toLowerCase(), address.toLowerCase(), tokenEntity.tokenId, value);

    await this.notificatorService.tokenTransfer({
      token: tokenEntity,
      from: from.toLowerCase(),
      to: to.toLowerCase(),
      amount: value, // TODO separate notifications for native\erc20\erc721\erc998\erc1155 ?
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: from === ZeroAddress ? to.toLowerCase() : from.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async transferBatch(event: ILogEvent<IErc1155TokenTransferBatchEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { from, to, ids /* 1155 db:tokenIds */, values },
    } = event;
    const { address, transactionHash } = context;

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

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: from === ZeroAddress ? to.toLowerCase() : from.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async approvalForAllErc1155(event: ILogEvent<IErc1155TokenApprovalForAllEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { account },
    } = event;
    const { transactionHash } = context;

    await this.eventHistoryService.updateHistory(event, context);

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: account.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async uri(event: ILogEvent<IErc1155TokenUriEvent>, context: Log): Promise<void> {
    const { name } = event;
    const { address, transactionHash } = context;

    const parentContractEntity = await this.contractService.findOne(
      { address: address.toLowerCase() },
      { relations: { merchant: true } },
    );

    if (!parentContractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, void 0, parentContractEntity.id);

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: parentContractEntity.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
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
