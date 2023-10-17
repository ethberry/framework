import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { JsonRpcProvider, Log, ZeroAddress } from "ethers";

import { ETHERS_RPC, ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";

import { testChainId } from "@framework/constants";
import { IERC721TokenTransferEvent, RmqProviderType, SignalEventType, TokenStatus } from "@framework/types";

import { LotteryTicketService } from "./ticket.service";
import { LotteryRoundService } from "../round/round.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { AssetService } from "../../../exchange/asset/asset.service";
import { getMetadata } from "../../../../common/utils";
import { ABI } from "../../../tokens/erc721/token/log/interfaces";

@Injectable()
export class LotteryTicketServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: JsonRpcProvider,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly lotteryTicketService: LotteryTicketService,
    private readonly lotteryRoundService: LotteryRoundService,
    private readonly eventHistoryService: EventHistoryService,
    protected readonly assetService: AssetService,
    private readonly contractService: ContractService,
    private readonly templateService: TemplateService,
    private readonly tokenService: TokenService,
    protected readonly balanceService: BalanceService,
    private readonly configService: ConfigService,
  ) {}

  public async transfer(event: ILogEvent<IERC721TokenTransferEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { from, to, tokenId },
    } = event;
    const { address, transactionHash } = context;

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const erc721TokenEntity =
      from === ZeroAddress
        ? await this.createTicketToken(address, tokenId, to, transactionHash)
        : await this.tokenService.getToken(tokenId, address.toLowerCase(), chainId, true);

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
    // default LOTTERY Ticket Template 1210101
    const templateEntity = await this.templateService.findOne(
      {
        contract: { address: contract.toLowerCase() },
      },
      { relations: { contract: true } },
    );

    if (!templateEntity) {
      throw new NotFoundException("ticketTemplateNotFound");
    }

    const metadata = await getMetadata(tokenId, contract, ABI, this.jsonRpcProvider, this.loggerService);

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
