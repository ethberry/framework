import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { JsonRpcProvider, Log, ZeroAddress } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import { ETHERS_RPC } from "@gemunion/nest-js-module-ethers-gcp";
import {
  IERC721TokenTransferEvent,
  IUnpackWrapper,
  RmqProviderType,
  SignalEventType,
  TokenMetadata,
  TokenStatus,
} from "@framework/types";

import { ContractService } from "../../../hierarchy/contract/contract.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { TokenServiceEth } from "../../../hierarchy/token/token.service.eth";
import { getMetadata } from "../../../../common/utils";
import { ABI } from "../../../tokens/erc721/token/log/interfaces";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { AssetService } from "../../../exchange/asset/asset.service";
import { EventHistoryService } from "../../../event-history/event-history.service";

@Injectable()
export class WrapperServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: JsonRpcProvider,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    protected readonly configService: ConfigService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly contractService: ContractService,
    private readonly tokenService: TokenService,
    private readonly tokenServiceEth: TokenServiceEth,
    private readonly balanceService: BalanceService,
    private readonly assetService: AssetService,
    private readonly templateService: TemplateService,
  ) {}

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

    await this.eventHistoryService.updateHistory(event, context, tokenEntity.id, tokenEntity.template.contractId);

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
        ABI,
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
        metadata: JSON.stringify(metadata),
        royalty: templateEntity.contract.royalty,
        template: templateEntity,
      });
      await this.balanceService.increment(tokenEntity.id, to.toLowerCase(), "1");
      await this.assetService.updateAssetHistory(transactionHash, tokenEntity);
    }

    const erc721TokenEntity = await this.tokenService.getToken(tokenId, address.toLowerCase(), void 0, true);

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
