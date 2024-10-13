import { Inject, Injectable, Logger, LoggerService, NotFoundException, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy } from "@nestjs/microservices";
import { Log, ZeroAddress } from "ethers";
import { DeepPartial } from "typeorm";

import { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import { ICollectionConsecutiveTransfer, RmqProviderType, SignalEventType, TokenStatus } from "@framework/types";

import { TokenService } from "../../../hierarchy/token/token.service";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { BalanceEntity } from "../../../hierarchy/balance/balance.entity";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { NotificatorService } from "../../../../game/notificator/notificator.service";
import { BalanceService } from "../../../hierarchy/balance/balance.service";

@Injectable()
export class CollectionServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    protected readonly tokenService: TokenService,
    protected readonly configService: ConfigService,
    protected readonly eventHistoryService: EventHistoryService,
    protected readonly templateService: TemplateService,
    protected readonly notificatorService: NotificatorService,
    protected readonly balanceService: BalanceService,
  ) {}

  public async consecutiveTransfer(event: ILogEvent<ICollectionConsecutiveTransfer>, context: Log): Promise<void> {
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
      await this.eventHistoryService.updateHistory(event, context);

      const description = JSON.parse(templateEntity.contract.description);
      const batchSize = description.batchSize ? description.batchSize : 0n;

      // const batchLen = BigNumber.from(toTokenId).sub(fromTokenId).toNumber();
      const batchLen = Number(toTokenId) - Number(fromTokenId);

      if (batchLen !== batchSize) {
        throw new BadRequestException("batchLengthError");
      }

      templateEntity.amount += batchSize;
      await templateEntity.save();

      const tokenArray: Array<DeepPartial<TokenEntity>> = [...Array(batchSize)].map((_, i) => ({
        metadata: "{}",
        tokenId: BigInt(i),
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
      amount: 1n,
      tokenId: tokenArray[i].id,
    }));

    await this.balanceService.createBatch(balanceArray);
  }
}
