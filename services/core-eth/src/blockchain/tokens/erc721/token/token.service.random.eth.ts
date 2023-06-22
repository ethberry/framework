import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { JsonRpcProvider, Log, ZeroAddress } from "ethers";
import { ETHERS_RPC, ILogEvent } from "@gemunion/nestjs-ethers";

import {
  ContractEventType,
  ExchangeType,
  IERC721TokenMintRandomEvent,
  IERC721TokenTransferEvent,
  IExchangePurchaseEvent,
  TokenMetadata,
  TokenMintType,
  TokenStatus,
} from "@framework/types";

import { ABI } from "./log/interfaces";
import { getMetadata, getTokenMintType, getTransactionLog } from "../../../../common/utils";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { TokenServiceEth } from "../../../hierarchy/token/token.service.eth";
import { AssetService } from "../../../exchange/asset/asset.service";
import { BreedServiceEth } from "../../../mechanics/breed/breed.service.eth";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { NotificatorService } from "../../../../game/notificator/notificator.service";

@Injectable()
export class Erc721TokenRandomServiceEth extends TokenServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: JsonRpcProvider,
    protected readonly tokenService: TokenService,
    protected readonly templateService: TemplateService,
    protected readonly balanceService: BalanceService,
    protected readonly assetService: AssetService,
    protected readonly breedServiceEth: BreedServiceEth,
    protected readonly eventHistoryService: EventHistoryService,
    private readonly notificatorService: NotificatorService,
  ) {
    super(loggerService, tokenService, eventHistoryService);
  }

  public async transfer(event: ILogEvent<IERC721TokenTransferEvent>, context: Log): Promise<void> {
    const {
      args: { from, to, tokenId },
    } = event;
    const { address, transactionHash } = context;

    // Mint token create
    if (from === ZeroAddress) {
      const metadata = await getMetadata(Number(tokenId).toString(), address, ABI, this.jsonRpcProvider);
      const templateId = Number(metadata[TokenMetadata.TEMPLATE_ID]);
      const templateEntity = await this.templateService.findOne({ id: templateId }, { relations: { contract: true } });
      if (!templateEntity) {
        this.loggerService.error("templateNotFound", templateId, Erc721TokenRandomServiceEth.name);
        throw new NotFoundException("templateNotFound");
      }

      const tokenEntity = await this.tokenService.create({
        tokenId,
        metadata,
        royalty: templateEntity.contract.royalty,
        templateId: templateEntity.id,
      });
      await this.balanceService.increment(tokenEntity.id, to.toLowerCase(), "1");
      await this.assetService.updateAssetHistory(transactionHash, tokenEntity.id);

      // if RANDOM token - update tokenId in exchange asset history
      if (metadata[TokenMetadata.RARITY] || metadata[TokenMetadata.TRAITS]) {
        // decide if it was random mint or common mint via admin-panel
        const txLogs = await getTransactionLog(transactionHash, this.jsonRpcProvider, address);
        const mintType = getTokenMintType(txLogs as Array<Log>);

        if (mintType === TokenMintType.MintRandom) {
          // update Asset history
          const historyEntity = await this.eventHistoryService.findOne({
            transactionHash,
            eventType: ContractEventType.MintRandom,
          });
          if (!historyEntity) {
            this.loggerService.error(
              "historyNotFound",
              transactionHash,
              ContractEventType.MintRandom,
              Erc721TokenRandomServiceEth.name,
            );
            throw new NotFoundException("historyNotFound");
          }
          const eventData = historyEntity.eventData as IERC721TokenMintRandomEvent;
          await this.assetService.updateAssetHistoryRandom(eventData.requestId, tokenEntity.id);
        }
      }

      // MODULE:BREEDING
      if (metadata[TokenMetadata.TRAITS]) {
        await this.breedServiceEth.newborn(
          tokenEntity.id,
          metadata[TokenMetadata.TRAITS],
          context.transactionHash.toLowerCase(),
        );
      }
    }

    const erc721TokenEntity = await this.tokenService.getToken(
      Number(tokenId).toString(),
      address.toLowerCase(),
      void 0,
      true,
    );

    // token must exist by this stage
    if (!erc721TokenEntity) {
      this.loggerService.error(
        "tokenNotFound",
        Number(tokenId),
        address.toLowerCase(),
        Erc721TokenRandomServiceEth.name,
      );
      throw new NotFoundException("tokenNotFound");
    }

    const { id } = await this.eventHistoryService.updateHistory(event, context, erc721TokenEntity.id);

    // get Purchase parent event and send notification about purchase
    await this.exchangeNotify(id);

    if (from === ZeroAddress) {
      erc721TokenEntity.template.amount += 1;
      erc721TokenEntity.tokenStatus = TokenStatus.MINTED;
    } else if (to === ZeroAddress) {
      erc721TokenEntity.tokenStatus = TokenStatus.BURNED;
    } else {
      // change token's owner
      erc721TokenEntity.balance[0].account = to.toLowerCase();
    }

    await erc721TokenEntity.save();
    // need to save updates in nested entities too
    await erc721TokenEntity.template.save();
    await erc721TokenEntity.balance[0].save();
  }

  public async mintRandom(event: ILogEvent<IERC721TokenMintRandomEvent>, context: Log): Promise<void> {
    // const {
    //   args: { tokenId, to },
    // } = event;
    const eventHistoryEntity = await this.eventHistoryService.updateHistory(event, context);

    const entityWithRelations = await this.eventHistoryService.findOne(
      { id: eventHistoryEntity.id },
      { relations: { parent: true, assets: true } },
    );

    if (!entityWithRelations) {
      this.loggerService.error("historyNotFound", eventHistoryEntity.id, TokenServiceEth.name);
      throw new NotFoundException("historyNotFound");
    }
  }

  // get Purchase parent event and send notification about purchase
  public async exchangeNotify(historyId: number) {
    const history = await this.eventHistoryService.findOneWithRelations({ id: historyId });
    // it must work for exchange purchase random
    if (
      history &&
      history.parent &&
      history.parent.parent &&
      history.parent.parent.parent &&
      history.parent.parent.parent.eventType === ContractEventType.Purchase
    ) {
      const exchangeEvent = history.parent.parent.parent;
      const eventData = exchangeEvent.eventData as unknown as IExchangePurchaseEvent;
      const exchangeAssetHistory = await this.assetService.findAll(
        { historyId: exchangeEvent.id },
        { relations: { token: { template: true }, contract: true } },
      );
      this.notificatorService.purchaseRandom({
        account: eventData.account.toLowerCase(),
        item: exchangeAssetHistory.filter(history => history.exchangeType === ExchangeType.ITEM)[0],
        price: exchangeAssetHistory.filter(history => history.exchangeType === ExchangeType.PRICE),
        transactionHash: exchangeEvent.transactionHash,
      });
    }
  }
}