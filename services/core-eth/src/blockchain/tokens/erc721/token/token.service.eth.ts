import { BadRequestException, Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy } from "@nestjs/microservices";
import { JsonRpcProvider, Log, stripZerosLeft, toUtf8String, ZeroAddress } from "ethers";
import { DeepPartial } from "typeorm";

import { ETHERS_RPC, ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";

import { testChainId } from "@framework/constants";
import type { IERC721ConsecutiveTransfer, IERC721TokenTransferEvent, ILevelUp } from "@framework/types";
import { RmqProviderType, SignalEventType, TokenMetadata, TokenStatus } from "@framework/types";

import { getMetadata } from "../../../../common/utils";
import { NotificatorService } from "../../../../game/notificator/notificator.service";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { TokenServiceEth } from "../../../hierarchy/token/token.service.eth";
import { AssetService } from "../../../exchange/asset/asset.service";
// import { BreedServiceEth } from "../../../mechanics/breed/breed.service.eth";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { BalanceEntity } from "../../../hierarchy/balance/balance.entity";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { ABI } from "./log/interfaces";

@Injectable()
export class Erc721TokenServiceEth extends TokenServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: JsonRpcProvider,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    private readonly signalClientProxy: ClientProxy,
    protected readonly tokenService: TokenService,
    protected readonly templateService: TemplateService,
    protected readonly balanceService: BalanceService,
    protected readonly assetService: AssetService,
    protected readonly configService: ConfigService,
    // protected readonly breedServiceEth: BreedServiceEth,
    protected readonly eventHistoryService: EventHistoryService,
    protected readonly notificatorService: NotificatorService,
  ) {
    super(loggerService, tokenService, eventHistoryService);
  }

  public async transfer(event: ILogEvent<IERC721TokenTransferEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { from, to, tokenId },
    } = event;
    const { address, transactionHash } = context;
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

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
        this.loggerService.error("templateNotFound", templateId, Erc721TokenServiceEth.name);
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

    const erc721TokenEntity = await this.tokenService.getToken(
      Number(tokenId).toString(),
      address.toLowerCase(),
      chainId,
      true,
    );

    if (!erc721TokenEntity) {
      this.loggerService.error("tokenNotFound", Number(tokenId), address.toLowerCase(), Erc721TokenServiceEth.name);
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

    await this.notificatorService.tokenTransfer({
      token: erc721TokenEntity,
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

  public async consecutiveTransfer(event: ILogEvent<IERC721ConsecutiveTransfer>, context: Log): Promise<void> {
    const {
      name,
      args: { fromAddress, toAddress, fromTokenId, toTokenId },
    } = event;
    const { address, transactionHash } = context;

    // Mint token create batch
    if (fromAddress === ZeroAddress) {
      const templateEntity = await this.templateService.findOne(
        { contract: { address } },
        { relations: { contract: true } },
      );

      if (!templateEntity) {
        throw new NotFoundException("templateNotFound");
      }
      await this.eventHistoryService.updateHistory(event, context, void 0, templateEntity.contract.id);

      const description = JSON.parse(templateEntity.contract.description);
      const batchSize = description.batchSize ? Number(description.batchSize) : 0;

      // const batchLen = BigNumber.from(toTokenId).sub(fromTokenId).toNumber();
      const batchLen = Number(toTokenId) - Number(fromTokenId);

      if (batchLen !== batchSize) {
        throw new BadRequestException("batchLengthError");
      }

      templateEntity.amount += batchSize;
      await templateEntity.save();

      const tokenArray: Array<DeepPartial<TokenEntity>> = [...Array(batchSize)].map((_, i) => ({
        metadata: "{}",
        tokenId: i.toString(),
        royalty: templateEntity.contract.royalty,
        templateId: templateEntity.id,
        tokenStatus: TokenStatus.MINTED,
      }));

      const entityArray = await this.tokenService.createBatch(tokenArray);

      await this.createBalancesBatch(toAddress, entityArray);
      // await this.assetService.updateAssetHistory(transactionHash, tokenEntity);

      await this.notificatorService.consecutiveTransfer({
        tokens: entityArray,
        from: fromAddress.toLowerCase(),
        to: toAddress.toLowerCase(),
      });
    }

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: fromAddress === ZeroAddress ? toAddress.toLowerCase() : fromAddress.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  private async createBalancesBatch(owner: string, tokenArray: Array<TokenEntity>) {
    const balanceArray: Array<DeepPartial<BalanceEntity>> = new Array(tokenArray.length).fill(null).map((_, i) => ({
      account: owner.toLowerCase(),
      amount: "1",
      tokenId: tokenArray[i].id,
    }));

    await this.balanceService.createBatch(balanceArray);
  }

  public async levelUp(event: ILogEvent<ILevelUp>, context: Log): Promise<void> {
    const {
      name,
      args: { tokenId, attribute, value },
    } = event;
    const { address, transactionHash } = context;
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const erc721TokenEntity = await this.tokenService.getToken(tokenId, address.toLowerCase(), chainId, true);

    if (!erc721TokenEntity) {
      this.loggerService.error("tokenNotFound", tokenId, address.toLowerCase(), Erc721TokenServiceEth.name);
      throw new NotFoundException("tokenNotFound");
    }

    Object.assign(erc721TokenEntity.metadata, { [toUtf8String(stripZerosLeft(attribute))]: value });
    await erc721TokenEntity.save();

    await this.eventHistoryService.updateHistory(event, context, erc721TokenEntity.id);

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: erc721TokenEntity.balance[0].account,
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }
}
