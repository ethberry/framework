import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { JsonRpcProvider, Log, ZeroAddress } from "ethers";

import { ETHERS_RPC, ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import {
  Erc721EventType,
  ExchangeEventType,
  IERC721TokenMintRandomEvent,
  IERC721TokenTransferEvent,
  IExchangePurchaseEvent,
} from "@framework/types";
import {
  ExchangeType,
  RmqProviderType,
  SignalEventType,
  TokenMetadata,
  TokenMintType,
  TokenStatus,
} from "@framework/types";

import { getMetadata, getTokenMintType, getTransactionLog } from "../../../../common/utils";
import { NotificatorService } from "../../../../game/notificator/notificator.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { TokenServiceEth } from "../../../hierarchy/token/token.service.eth";
import { AssetService } from "../../../exchange/asset/asset.service";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { Erc721ABI } from "../../erc721/token/interfaces";

@Injectable()
export class Erc998TokenRandomServiceEth extends TokenServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: JsonRpcProvider,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    protected readonly tokenService: TokenService,
    protected readonly balanceService: BalanceService,
    protected readonly templateService: TemplateService,
    protected readonly eventHistoryService: EventHistoryService,
    protected readonly contractService: ContractService,
    protected readonly assetService: AssetService,
    private readonly notificatorService: NotificatorService,
  ) {
    super(loggerService, signalClientProxy, tokenService, eventHistoryService);
  }

  public async transfer(event: ILogEvent<IERC721TokenTransferEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { from, to, tokenId },
    } = event;
    const { address, transactionHash } = context;

    // Mint token create
    if (from === ZeroAddress) {
      const metadata = await getMetadata(
        Number(tokenId).toString(),
        address,
        Erc721ABI,
        this.jsonRpcProvider,
        this.loggerService,
      );
      const templateId = Number(metadata[TokenMetadata.TEMPLATE_ID]);
      const templateEntity = await this.templateService.findOne({ id: templateId }, { relations: { contract: true } });

      if (!templateEntity) {
        throw new NotFoundException("templateNotFound");
      }

      const tokenEntity = await this.tokenService.create({
        tokenId,
        metadata,
        royalty: templateEntity.contract.royalty,
        template: templateEntity,
      });

      await this.balanceService.increment(tokenEntity.id, to.toLowerCase(), "1");
      await this.assetService.updateAssetHistory(context.transactionHash, tokenEntity);

      // if RANDOM token - update tokenId in exchange asset history
      if (metadata[TokenMetadata.RARITY] || metadata[TokenMetadata.TRAITS]) {
        // decide if it was random mint or common mint via admin-panel
        const txLogs = await getTransactionLog(transactionHash, this.jsonRpcProvider, address);
        const mintType = getTokenMintType(txLogs as Array<Log>);

        if (mintType === TokenMintType.MintRandom) {
          // update Asset history
          const historyEntity = await this.eventHistoryService.findOne({
            transactionHash,
            eventType: Erc721EventType.MintRandom,
          });
          if (!historyEntity) {
            throw new NotFoundException("historyNotFound");
          }
          const eventData = historyEntity.eventData as IERC721TokenMintRandomEvent;
          await this.assetService.updateAssetHistoryRandom(eventData.requestId, tokenEntity.id);
        }
      }
    }

    const erc998TokenEntity = await this.tokenService.getToken(
      Number(tokenId).toString(),
      address.toLowerCase(),
      void 0,
      true,
    );

    if (!erc998TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    const { id } = await this.eventHistoryService.updateHistory(event, context, erc998TokenEntity.id);

    // get Purchase parent event and send notification about purchase
    await this.exchangeNotify(id);

    if (from === ZeroAddress) {
      erc998TokenEntity.template.amount += 1;
      // tokenEntity.template
      //   ? (erc998TokenEntity.template.instanceCount += 1)
      //   : (erc998TokenEntity.erc998Mysterybox.erc998Template.instanceCount += 1);
      erc998TokenEntity.tokenStatus = TokenStatus.MINTED;
    } else if (to === ZeroAddress) {
      // erc998TokenEntity.erc998Template.instanceCount -= 1;
      erc998TokenEntity.tokenStatus = TokenStatus.BURNED;
    } else {
      // change token's owner
      erc998TokenEntity.balance[0].account = to.toLowerCase();
    }

    await erc998TokenEntity.save();

    // need to save updates in nested entities too
    await erc998TokenEntity.template.save();
    await erc998TokenEntity.balance[0].save();

    // erc998TokenEntity.erc998Template
    //   ? await erc998TokenEntity.erc998Template.save()
    //   : await erc998TokenEntity.erc998Mysterybox.erc998Template.save();

    await this.notificatorService.tokenTransfer({
      token: erc998TokenEntity,
      from: from.toLowerCase(),
      to: to.toLowerCase(),
      amount: "1", // TODO separate notifications for native\erc20\erc721\erc998\erc1155 ?
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: from === ZeroAddress ? to.toLowerCase() : from.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async mintRandom(event: ILogEvent<IERC721TokenMintRandomEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      name,
      args: { to },
    } = event;
    const { transactionHash } = context;

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: to.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  // get Purchase parent event and send notification about purchase
  public async exchangeNotify(historyId: number) {
    const history = await this.eventHistoryService.findOneWithRelations({ id: historyId });
    // it must work for exchange purchase random
    if (history?.parent?.parent?.parent?.eventType === ExchangeEventType.Purchase) {
      const exchangeEvent = history.parent.parent.parent;
      const eventData = exchangeEvent.eventData as unknown as IExchangePurchaseEvent;
      const exchangeAssetHistory = await this.assetService.findAll(
        { historyId: exchangeEvent.id },
        { relations: { token: { template: true }, contract: true } },
      );

      await this.notificatorService.purchaseRandom({
        account: eventData.account.toLowerCase(),
        item: exchangeAssetHistory.find(history => history.exchangeType === ExchangeType.ITEM)!,
        price: exchangeAssetHistory.filter(history => history.exchangeType === ExchangeType.PRICE),
        transactionHash: exchangeEvent.transactionHash,
      });
    }
  }
}
