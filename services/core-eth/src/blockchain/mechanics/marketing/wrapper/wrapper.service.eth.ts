import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { JsonRpcProvider, Log, ZeroAddress } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import { ETHERS_RPC } from "@ethberry/nest-js-module-ethers-gcp";
import {
  IERC721TokenTransferEvent,
  IUnpackWrapper,
  RmqProviderType,
  SignalEventType,
  TokenMetadata,
  TokenStatus,
} from "@framework/types";

import { TokenService } from "../../../hierarchy/token/token.service";
import { getMetadata } from "../../../../common/utils";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { AssetService } from "../../../exchange/asset/asset.service";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { TokenServiceEth } from "../../../hierarchy/token/token.service.eth";
import { WrapperABI } from "./interfaces";

@Injectable()
export class WrapperServiceEth extends TokenServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: JsonRpcProvider,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    protected readonly configService: ConfigService,
    protected readonly eventHistoryService: EventHistoryService,
    protected readonly tokenService: TokenService,
    protected readonly balanceService: BalanceService,
    protected readonly assetService: AssetService,
    protected readonly templateService: TemplateService,
  ) {
    super(loggerService, signalClientProxy, tokenService, eventHistoryService);
  }

  public async unpack(event: ILogEvent<IUnpackWrapper>, context: Log): Promise<void> {
    const {
      name,
      args: { tokenId },
    } = event;
    const { transactionHash, address } = context;

    const tokenEntity = await this.tokenService.getToken(Number(tokenId).toString(), address.toLowerCase());

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, tokenEntity.id);

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: tokenEntity.template.contract.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
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
        WrapperABI,
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
      await this.assetService.updateAssetHistory(transactionHash, tokenEntity);
    }

    const erc721TokenEntity = await this.tokenService.getToken(tokenId, address.toLowerCase(), true);

    if (!erc721TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, erc721TokenEntity.id);

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

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: from === ZeroAddress ? to.toLowerCase() : from.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }
}
