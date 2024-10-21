import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy } from "@nestjs/microservices";
import { Log, ZeroAddress } from "ethers";
import { DeepPartial } from "typeorm";

import { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { ICollectionConsecutiveTransfer, IContractManagerCommonDeployedEvent } from "@framework/types";
import { RmqProviderType, SignalEventType, TokenStatus } from "@framework/types";

import { NotificatorService } from "../../../../game/notificator/notificator.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { BalanceEntity } from "../../../hierarchy/balance/balance.entity";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { CollectionServiceLog } from "./collection.service.log";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";

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
    protected readonly collectionServiceLog: CollectionServiceLog,
  ) {}

  public async consecutiveTransfer(event: ILogEvent<ICollectionConsecutiveTransfer>, context: Log): Promise<void> {
    const {
      name,
      args: { fromAddress, toAddress },
    } = event;
    const { address, transactionHash } = context;

    const templateEntity = await this.templateService.findOne(
      { contract: { address } },
      { relations: { contract: true } },
    );

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context);

    const tokenEntities = await this.createTokensBatch(templateEntity);
    await this.createBalancesBatch(toAddress, tokenEntities);

    await this.notificatorService.consecutiveTransfer({
      template: templateEntity,
      tokens: tokenEntities,
      from: fromAddress.toLowerCase(),
      to: toAddress.toLowerCase(),
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: fromAddress === ZeroAddress ? toAddress.toLowerCase() : fromAddress.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  private async createTokensBatch(templateEntity: TemplateEntity) {
    const data = new Date().toISOString();
    const tokenArray: Array<DeepPartial<TokenEntity>> = [...Array(templateEntity.contract.parameters.batchSize)].map(
      (_, i) => ({
        metadata: "{}",
        tokenId: i.toString(),
        templateId: templateEntity.id,
        imageUrl: templateEntity.imageUrl,
        tokenStatus: TokenStatus.MINTED,
        createdAt: data,
        updatedAt: data,
      }),
    );

    return this.tokenService.createBatch(tokenArray);
  }

  private async createBalancesBatch(owner: string, tokenArray: Array<TokenEntity>) {
    const data = new Date().toISOString();
    const balanceArray: Array<DeepPartial<BalanceEntity>> = new Array(tokenArray.length).fill(null).map((_, i) => ({
      account: owner.toLowerCase(),
      amount: "1",
      tokenId: tokenArray[i].id,
      createdAt: data,
      updatedAt: data,
    }));

    return this.balanceService.createBatch(balanceArray);
  }

  public async deploy(event: ILogEvent<IContractManagerCommonDeployedEvent>, context: Log): Promise<void> {
    const {
      args: { account },
    } = event;

    await this.collectionServiceLog.readLastBlock([account], parseInt(context.blockNumber.toString(), 16));
  }
}
