import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { JsonRpcProvider, Log, ZeroAddress } from "ethers";

import { ETHERS_RPC, ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import { IERC721TokenTransferEvent, RmqProviderType, SignalEventType, TokenStatus } from "@framework/types";

import { TemplateService } from "../../../../hierarchy/template/template.service";
import { TokenService } from "../../../../hierarchy/token/token.service";
import { BalanceService } from "../../../../hierarchy/balance/balance.service";
import { EventHistoryService } from "../../../../event-history/event-history.service";
import { TokenEntity } from "../../../../hierarchy/token/token.entity";
import { getMetadata } from "../../../../../common/utils";
import { ERC721SimpleABI } from "../../../../tokens/erc721/token/interfaces";
import { AssetService } from "../../../../exchange/asset/asset.service";

@Injectable()
export class RaffleTicketServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: JsonRpcProvider,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly eventHistoryService: EventHistoryService,
    protected readonly assetService: AssetService,
    private readonly templateService: TemplateService,
    private readonly tokenService: TokenService,
    protected readonly balanceService: BalanceService,
  ) {}

  public async transfer(event: ILogEvent<IERC721TokenTransferEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { from, to, tokenId },
    } = event;
    const { address, transactionHash } = context;

    const erc721TokenEntity =
      from === ZeroAddress
        ? await this.createTicketToken(address, tokenId, to, transactionHash)
        : await this.tokenService.getToken(tokenId, address.toLowerCase(), true);

    if (!erc721TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, erc721TokenEntity.id);

    if (to === ZeroAddress) {
      erc721TokenEntity.tokenStatus = TokenStatus.BURNED;
      await erc721TokenEntity.save();
    } else if (to !== ZeroAddress && from !== ZeroAddress) {
      // change token's owner
      erc721TokenEntity.balance[0].account = to.toLowerCase();
      // need to save updates in nested entities too
      await erc721TokenEntity.balance[0].save();
      await erc721TokenEntity.save();
    }

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: from === ZeroAddress ? to.toLowerCase() : from.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async createTicketToken(
    contract: string,
    tokenId: string,
    account: string,
    transactionHash: string,
  ): Promise<TokenEntity> {
    // default RAFFLE Ticket Template 1110101
    const templateEntity = await this.templateService.findOne(
      {
        contract: { address: contract.toLowerCase() },
      },
      { relations: { contract: true } },
    );

    if (!templateEntity) {
      throw new NotFoundException("ticketTemplateNotFound");
    }

    const metadata = await getMetadata(tokenId, contract, ERC721SimpleABI, this.jsonRpcProvider, this.loggerService);

    const tokenEntity = await this.tokenService.create({
      tokenId,
      metadata,
      royalty: templateEntity.contract.royalty,
      template: templateEntity,
      tokenStatus: TokenStatus.MINTED,
    });

    await this.balanceService.increment(tokenEntity.id, account.toLowerCase(), "1");
    await this.assetService.updateAssetHistory(transactionHash, tokenEntity);

    return tokenEntity;
  }
}
