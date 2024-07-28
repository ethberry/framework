import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy } from "@nestjs/microservices";
import { Log, stripZerosLeft, toUtf8String } from "ethers";

import { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import { testChainId } from "@framework/constants";
import type { ILevelUp } from "@framework/types";
import { RmqProviderType, SignalEventType } from "@framework/types";

import { TemplateService } from "../../../hierarchy/template/template.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { EventHistoryService } from "../../../event-history/event-history.service";

@Injectable()
export class DiscreteServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    protected readonly tokenService: TokenService,
    protected readonly templateService: TemplateService,
    protected readonly configService: ConfigService,
    protected readonly eventHistoryService: EventHistoryService,
  ) {}

  public async levelUp(event: ILogEvent<ILevelUp>, context: Log): Promise<void> {
    const {
      name,
      args: { tokenId, attribute, value },
    } = event;
    const { address, transactionHash } = context;
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const erc721TokenEntity = await this.tokenService.getToken(tokenId, address.toLowerCase(), chainId, true);

    if (!erc721TokenEntity) {
      this.loggerService.error("tokenNotFound", tokenId, address.toLowerCase(), DiscreteServiceEth.name);
      throw new NotFoundException("tokenNotFound");
    }

    Object.assign(erc721TokenEntity.metadata, { [toUtf8String(stripZerosLeft(attribute))]: value });
    await erc721TokenEntity.save();

    await this.eventHistoryService.updateHistory(
      event,
      context,
      erc721TokenEntity.id,
      erc721TokenEntity.template.contractId,
    );

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: erc721TokenEntity.balance[0].account,
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }
}
