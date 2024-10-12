import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { JsonRpcProvider, Log, ZeroAddress } from "ethers";

import { ETHERS_RPC, ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IERC721TokenTransferEvent, IUnpackLootBoxEvent } from "@framework/types";
import { RmqProviderType, SignalEventType, TokenMetadata, TokenStatus } from "@framework/types";

import { getMetadata } from "../../../../../common/utils";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { TemplateService } from "../../../../hierarchy/template/template.service";
import { TokenService } from "../../../../hierarchy/token/token.service";
import { BalanceService } from "../../../../hierarchy/balance/balance.service";
import { TokenServiceEth } from "../../../../hierarchy/token/token.service.eth";
import { EventHistoryService } from "../../../../event-history/event-history.service";
import { AssetService } from "../../../../exchange/asset/asset.service";
import { NotificatorService } from "../../../../../game/notificator/notificator.service";
import { LootABI } from "./interfaces";

@Injectable()
export class LootBoxServiceEth extends TokenServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: JsonRpcProvider,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    protected readonly contractService: ContractService,
    protected readonly tokenService: TokenService,
    protected readonly templateService: TemplateService,
    protected readonly balanceService: BalanceService,
    protected readonly assetService: AssetService,
    protected readonly eventHistoryService: EventHistoryService,
    protected readonly notificatorService: NotificatorService,
  ) {
    super(loggerService, signalClientProxy, tokenService, eventHistoryService);
  }

  public async transfer(event: ILogEvent<IERC721TokenTransferEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { from, to, tokenId },
    } = event;
    const { address, transactionHash } = context;

    const contractEntity = await this.contractService.findOne({ address: address.toLowerCase() });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    // Mint token create
    if (from === ZeroAddress) {
      const metadata = await getMetadata(tokenId, address, LootABI, this.jsonRpcProvider, this.loggerService);
      const templateId = ~~metadata[TokenMetadata.TEMPLATE_ID];

      const templateEntity = await this.templateService.findOne({ id: templateId });

      if (!templateEntity) {
        throw new NotFoundException("templateNotFound");
      }

      const tokenEntity = await this.tokenService.create({
        tokenId,
        metadata,
        royalty: contractEntity.royalty,
        template: templateEntity,
      });

      await this.balanceService.increment(tokenEntity.id, to.toLowerCase(), "1");
      await this.assetService.updateAssetHistory(transactionHash, tokenEntity);
    }

    const lootBoxTokenEntity = await this.tokenService.getToken(
      Number(tokenId).toString(),
      address.toLowerCase(),
      true,
    );

    if (!lootBoxTokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, lootBoxTokenEntity.id);

    if (from === ZeroAddress) {
      lootBoxTokenEntity.template.amount += 1;
      // lootBoxTokenEntity.erc721Template
      //   ? (lootBoxTokenEntity.template.instanceCount += 1)
      //   : (lootBoxTokenEntity.loot.template.instanceCount += 1);
      lootBoxTokenEntity.tokenStatus = TokenStatus.MINTED;
    } else if (to === ZeroAddress) {
      // lootBoxTokenEntity.erc721Template.instanceCount -= 1;
      lootBoxTokenEntity.tokenStatus = TokenStatus.BURNED;
    } else {
      // change token's owner
      lootBoxTokenEntity.balance[0].account = to.toLowerCase();
    }

    await lootBoxTokenEntity.save();

    // need to save updates in nested entities too
    await lootBoxTokenEntity.template.save();
    await lootBoxTokenEntity.balance[0].save();

    // lootBoxTokenEntity.erc721Template
    //   ? await lootBoxTokenEntity.template.save()
    //   : await lootBoxTokenEntity.loot.template.save();
    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: from === ZeroAddress ? to.toLowerCase() : from.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async unpack(event: ILogEvent<IUnpackLootBoxEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { account, tokenId },
    } = event;
    const { address, transactionHash } = context;

    const tokenEntity = await this.tokenService.getToken(tokenId, address.toLowerCase());

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, tokenEntity.id);

    await this.notificatorService.unpackLoot({
      items: [],
      price: [],
      merchantId: tokenEntity.template.contract.merchantId,
      address,
      transactionHash,
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: account.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }
}
