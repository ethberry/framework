import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { JsonRpcProvider, Log, ZeroAddress } from "ethers";

import { ETHERS_RPC, ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type {
  IContractManagerCommonDeployedEvent,
  IERC721TokenTransferEvent,
  IErc998BatchReceivedChildEvent,
  IErc998BatchTransferChildEvent,
  IErc998TokenReceivedChildEvent,
  IErc998TokenSetMaxChildEvent,
  IErc998TokenTransferChildEvent,
  IErc998TokenUnWhitelistedChildEvent,
  IErc998TokenWhitelistedChildEvent,
} from "@framework/types";
import { RmqProviderType, SignalEventType, TokenMetadata, TokenStatus } from "@framework/types";

import { getMetadata } from "../../../../common/utils";
import { NotificatorService } from "../../../../game/notificator/notificator.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { AssetService } from "../../../exchange/asset/asset.service";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { Erc998CompositionService } from "../composition/composition.service";
import { TokenServiceEth } from "../../../hierarchy/token/token.service.eth";
import { Erc998TokenServiceLog } from "./token.service.log";
import { ERC998SimpleABI } from "./interfaces";

@Injectable()
export class Erc998TokenServiceEth extends TokenServiceEth {
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
    protected readonly erc998TokenServiceLog: Erc998TokenServiceLog,
  ) {
    super(loggerService, signalClientProxy, tokenService, eventHistoryService);
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
        ERC998SimpleABI,
        this.jsonRpcProvider,
        this.loggerService,
      );
      const templateId = Number(metadata[TokenMetadata.TEMPLATE_ID]);
      const templateEntity = await this.templateService.findOne({ id: templateId }, { relations: { contract: true } });

      if (!templateEntity) {
        this.loggerService.error("templateNotFound", templateId, Erc998TokenServiceEth.name);
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

    const erc998TokenEntity = await this.tokenService.getToken(Number(tokenId).toString(), address.toLowerCase(), true);

    if (!erc998TokenEntity) {
      this.loggerService.error("tokenNotFound", Number(tokenId), address.toLowerCase(), Erc998TokenServiceEth.name);
      throw new NotFoundException("tokenNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, erc998TokenEntity.id);

    if (from === ZeroAddress) {
      erc998TokenEntity.template.amount += 1;
      erc998TokenEntity.tokenStatus = TokenStatus.MINTED;
    } else if (to === ZeroAddress) {
      erc998TokenEntity.tokenStatus = TokenStatus.BURNED;
    } else {
      // change token's owner
      erc998TokenEntity.balance[0].account = to.toLowerCase();
    }

    await erc998TokenEntity.save();
    // need to save updates in nested entities too
    await erc998TokenEntity.template.save();
    await erc998TokenEntity.balance[0].save();

    await this.notificatorService.tokenTransfer({
      token: erc998TokenEntity,
      from: from.toLowerCase(),
      to: to.toLowerCase(),
      amount: "1",
    });

    if (from !== ZeroAddress) {
      await this.signalClientProxy
        .emit(SignalEventType.TRANSACTION_HASH, {
          account: from.toLowerCase(),
          transactionHash,
          transactionType: name,
        })
        .toPromise();
    }

    if (to !== ZeroAddress) {
      await this.signalClientProxy
        .emit(SignalEventType.TRANSACTION_HASH, {
          account: to.toLowerCase(),
          transactionHash,
          transactionType: name,
        })
        .toPromise();
    }
  }

  public async receivedChild(event: ILogEvent<IErc998TokenReceivedChildEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { tokenId, childContract, childTokenId },
    } = event;
    const { transactionHash } = context;

    const erc998TokenEntity = await this.tokenService.getToken(
      Number(tokenId).toString(),
      context.address.toLowerCase(),
      true,
    );

    if (!erc998TokenEntity) {
      throw new NotFoundException("token998NotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, erc998TokenEntity.id);

    const tokenEntity = await this.tokenService.getToken(Number(childTokenId).toString(), childContract.toLowerCase());

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    const balanceEntity = await this.balanceService.findOne({
      account: erc998TokenEntity.template.contract.address,
      tokenId: tokenEntity.id,
    });

    if (!balanceEntity) {
      throw new NotFoundException("balanceNotFound");
    }

    Object.assign(balanceEntity, { targetId: erc998TokenEntity.id });
    await balanceEntity.save();

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

    const erc998TokenEntity = await this.tokenService.getToken(
      Number(tokenId).toString(),
      context.address.toLowerCase(),
      true,
    );

    if (!erc998TokenEntity) {
      throw new NotFoundException("token998NotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, erc998TokenEntity.id);

    const promises = childTokenIds.map(async (childTokenId, i) => {
      const childTokenEntity = await this.tokenService.getToken(
        Number(childTokenId).toString(),
        childContract.toLowerCase(),
      );

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

    const erc721TokenEntity = await this.tokenService.getToken(
      Number(childTokenId).toString(),
      childContract.toLowerCase(),
    );

    if (!erc721TokenEntity) {
      throw new NotFoundException("token721NotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, erc721TokenEntity.id);

    const balanceEntity = await this.balanceService.findOne({
      account: to.toLowerCase(),
      tokenId: erc721TokenEntity.id,
    });

    if (!balanceEntity) {
      throw new NotFoundException("balanceNotFound");
    }

    Object.assign(balanceEntity, { targetId: null });
    await balanceEntity.save();

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
      const childTokenEntity = await this.tokenService.getToken(
        Number(childTokenId).toString(),
        childContract.toLowerCase(),
      );

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

  public deploy(event: ILogEvent<IContractManagerCommonDeployedEvent>): void {
    const {
      args: { account },
    } = event;

    this.erc998TokenServiceLog.updateRegistry([account]);
  }
}
