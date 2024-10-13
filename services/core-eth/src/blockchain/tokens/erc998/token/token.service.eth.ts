import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { JsonRpcProvider, Log } from "ethers";

import { ETHERS_RPC, ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type {
  IErc998BatchReceivedChildEvent,
  IErc998BatchTransferChildEvent,
  IErc998TokenReceivedChildEvent,
  IErc998TokenSetMaxChildEvent,
  IErc998TokenTransferChildEvent,
  IErc998TokenUnWhitelistedChildEvent,
  IErc998TokenWhitelistedChildEvent,
} from "@framework/types";
import { RmqProviderType, SignalEventType } from "@framework/types";

import { NotificatorService } from "../../../../game/notificator/notificator.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { Erc721TokenServiceEth } from "../../erc721/token/token.service.eth";
import { AssetService } from "../../../exchange/asset/asset.service";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { Erc998CompositionService } from "../composition/composition.service";

@Injectable()
export class Erc998TokenServiceEth extends Erc721TokenServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: JsonRpcProvider,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    protected readonly tokenService: TokenService,
    protected readonly templateService: TemplateService,
    protected readonly balanceService: BalanceService,
    protected readonly assetService: AssetService,
    protected readonly eventHistoryService: EventHistoryService,
    protected readonly notificatorService: NotificatorService,
    protected readonly contractService: ContractService,
    protected readonly erc998CompositionService: Erc998CompositionService,
  ) {
    super(
      loggerService,
      jsonRpcProvider,
      signalClientProxy,
      tokenService,
      templateService,
      balanceService,
      assetService,
      eventHistoryService,
      notificatorService,
    );
  }

  public async receivedChild(event: ILogEvent<IErc998TokenReceivedChildEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { tokenId, childContract, childTokenId },
    } = event;
    const { transactionHash } = context;

    const erc998TokenEntity = await this.tokenService.getToken(tokenId, context.address.toLowerCase(), true);

    if (!erc998TokenEntity) {
      throw new NotFoundException("token998NotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, erc998TokenEntity.id);

    const tokenEntity = await this.tokenService.getToken(childTokenId, childContract.toLowerCase());

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.balanceService.create({
      account: erc998TokenEntity.template.contract.address,
      targetId: erc998TokenEntity.id,
      tokenId: tokenEntity.id,
      amount: 1n,
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: erc998TokenEntity.balance[0].account,
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async receivedChildBatch(event: ILogEvent<IErc998BatchReceivedChildEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { tokenId, childContract, childTokenIds, amounts },
    } = event;
    const { transactionHash } = context;

    const erc998TokenEntity = await this.tokenService.getToken(tokenId, context.address.toLowerCase(), true);

    if (!erc998TokenEntity) {
      throw new NotFoundException("token998NotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, erc998TokenEntity.id);

    const promises = childTokenIds.map(async (childTokenId, i) => {
      const childTokenEntity = await this.tokenService.getToken(childTokenId, childContract.toLowerCase());

      if (!childTokenEntity) {
        throw new NotFoundException("childTokenNotFound");
      }

      await this.balanceService.create({
        account: erc998TokenEntity.template.contract.address,
        targetId: erc998TokenEntity.id,
        tokenId: childTokenEntity.id,
        amount: amounts[i],
      });
    });

    await Promise.allSettled(promises).then(res =>
      res.forEach(value => {
        if (value.status === "rejected") {
          this.loggerService.error(value.reason, Erc998TokenServiceEth.name);
        }
      }),
    );

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: erc998TokenEntity.balance[0].account,
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async transferChild(event: ILogEvent<IErc998TokenTransferChildEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { to, childContract, childTokenId },
    } = event;
    const { transactionHash } = context;

    const erc721TokenEntity = await this.tokenService.getToken(childTokenId, childContract.toLowerCase());

    if (!erc721TokenEntity) {
      throw new NotFoundException("token721NotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, erc721TokenEntity.id);

    const balanceEntity = await this.balanceService.findOne({
      tokenId: erc721TokenEntity.id,
    });

    if (!balanceEntity) {
      throw new NotFoundException("balanceNotFound");
    }

    // await balanceEntity.remove();
    await this.balanceService.delete({ id: balanceEntity.id });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: to.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async transferChildBatch(event: ILogEvent<IErc998BatchTransferChildEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { to, childContract, childTokenIds, amounts },
    } = event;
    const { transactionHash } = context;

    const promises = childTokenIds.map(async (childTokenId, i) => {
      const childTokenEntity = await this.tokenService.getToken(childTokenId, childContract.toLowerCase());

      if (!childTokenEntity) {
        throw new NotFoundException("childTokenNotFound");
      }

      await this.eventHistoryService.updateHistory(event, context, childTokenEntity.id);

      const balanceEntity = await this.balanceService.findOne({ tokenId: childTokenEntity.id });

      if (!balanceEntity) {
        throw new NotFoundException("balanceNotFound");
      }

      if (~~balanceEntity.amount > ~~amounts[i]) {
        Object.assign(balanceEntity, { amount: ~~balanceEntity.amount - ~~amounts[i] });
        await balanceEntity.save();
      } else {
        await this.balanceService.delete({ id: balanceEntity.id });
      }
    });

    await Promise.allSettled(promises).then(res =>
      res.forEach(value => {
        if (value.status === "rejected") {
          this.loggerService.error(value.reason, Erc998TokenServiceEth.name);
        }
      }),
    );

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: to.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async whitelistChild(event: ILogEvent<IErc998TokenWhitelistedChildEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { addr, maxCount },
    } = event;
    const { address, transactionHash } = context;
    const parentContractEntity = await this.contractService.findOne(
      { address: address.toLowerCase() },
      { relations: { merchant: true } },
    );

    if (!parentContractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context);

    const childContractEntity = await this.contractService.findOne({ address: addr.toLowerCase() });

    if (!childContractEntity) {
      throw new NotFoundException("contractChildNotFound");
    }

    await this.erc998CompositionService.upsert({
      parentId: parentContractEntity.id,
      childId: childContractEntity.id,
      amount: Number(maxCount),
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: parentContractEntity.merchant.wallet,
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async unWhitelistChild(event: ILogEvent<IErc998TokenUnWhitelistedChildEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { addr },
    } = event;
    const { address, transactionHash } = context;

    const parentContractEntity = await this.contractService.findOne(
      { address: address.toLowerCase() },
      { relations: { merchant: true } },
    );

    if (!parentContractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context);

    const childContractEntity = await this.contractService.findOne({ address: addr.toLowerCase() });

    if (!childContractEntity) {
      throw new NotFoundException("contractChildNotFound");
    }

    // DEACTIVATE
    await this.erc998CompositionService.deactivate({
      parentId: parentContractEntity.id,
      childId: childContractEntity.id,
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: parentContractEntity.merchant.wallet,
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async setMaxChild(event: ILogEvent<IErc998TokenSetMaxChildEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { addr, maxCount },
    } = event;
    const { address, transactionHash } = context;

    const parentContractEntity = await this.contractService.findOne(
      { address: address.toLowerCase() },
      { relations: { merchant: true } },
    );

    if (!parentContractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context);

    const childContractEntity = await this.contractService.findOne({ address: addr.toLowerCase() });

    if (!childContractEntity) {
      throw new NotFoundException("contractChildNotFound");
    }

    const compositionEntity = await this.erc998CompositionService.findOne({
      parentId: parentContractEntity.id,
      childId: childContractEntity.id,
    });

    if (!compositionEntity) {
      throw new NotFoundException("compositionNotFound");
    }

    Object.assign(compositionEntity, { amount: Number(maxCount) });
    await compositionEntity.save();

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: parentContractEntity.merchant.wallet,
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }
}
