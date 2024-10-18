import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy } from "@nestjs/microservices";
import { Log, stripZerosLeft, toUtf8String } from "ethers";

import { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IContractManagerERC721TokenDeployedEvent, ILevelUp } from "@framework/types";
import { ContractFeatures, Erc721ContractTemplates, RmqProviderType, SignalEventType } from "@framework/types";

import { TokenService } from "../../../hierarchy/token/token.service";
import { TokenServiceEth } from "../../../hierarchy/token/token.service.eth";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { DiscreteServiceLog } from "./discrete.service.log";

@Injectable()
export class DiscreteServiceEth extends TokenServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    protected readonly tokenService: TokenService,
    protected readonly configService: ConfigService,
    protected readonly eventHistoryService: EventHistoryService,
    protected readonly discreteServiceLog: DiscreteServiceLog,
  ) {
    super(loggerService, signalClientProxy, tokenService, eventHistoryService);
  }

  public async levelUp(event: ILogEvent<ILevelUp>, context: Log): Promise<void> {
    const {
      name,
      args: { tokenId, attribute, value },
    } = event;
    const { address, transactionHash } = context;

    const erc721TokenEntity = await this.tokenService.getToken(tokenId, address.toLowerCase(), true);

    if (!erc721TokenEntity) {
      this.loggerService.error("tokenNotFound", tokenId, address.toLowerCase(), DiscreteServiceEth.name);
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

  public deploy(event: ILogEvent<IContractManagerERC721TokenDeployedEvent>): void {
    const {
      args: { account, args },
    } = event;

    const { contractTemplate } = args;

    const contractFeatures = Object.values(Erc721ContractTemplates)[Number(contractTemplate)].split("_");
    if (!contractFeatures.includes(ContractFeatures.DISCRETE)) {
      return;
    }

    this.discreteServiceLog.updateRegistry([account]);
  }
}
