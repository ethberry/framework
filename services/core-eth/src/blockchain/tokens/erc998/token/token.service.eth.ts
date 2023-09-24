import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { JsonRpcProvider, Log, stripZerosLeft, toUtf8String, ZeroAddress } from "ethers";

import { ETHERS_RPC, ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type {
  IERC721TokenTransferEvent,
  IErc998BatchReceivedChildEvent,
  IErc998BatchTransferChildEvent,
  IErc998TokenReceivedChildEvent,
  IErc998TokenSetMaxChildEvent,
  IErc998TokenTransferChildEvent,
  IErc998TokenUnWhitelistedChildEvent,
  IErc998TokenWhitelistedChildEvent,
  ILevelUp,
} from "@framework/types";
import { testChainId } from "@framework/constants";

import { RmqProviderType, SignalEventType, TokenMetadata, TokenStatus } from "@framework/types";

import { getMetadata } from "../../../../common/utils";
import { NotificatorService } from "../../../../game/notificator/notificator.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { TokenServiceEth } from "../../../hierarchy/token/token.service.eth";
import { AssetService } from "../../../exchange/asset/asset.service";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { ABI } from "../../erc721/token/log/interfaces";
import { Erc998CompositionService } from "../composition/composition.service";

@Injectable()
export class Erc998TokenServiceEth extends TokenServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: JsonRpcProvider,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    private readonly signalClientProxy: ClientProxy,
    protected readonly tokenService: TokenService,
    protected readonly balanceService: BalanceService,
    protected readonly templateService: TemplateService,
    protected readonly eventHistoryService: EventHistoryService,
    protected readonly contractService: ContractService,
    protected readonly assetService: AssetService,
    protected readonly configService: ConfigService,
    protected readonly erc998CompositionService: Erc998CompositionService,
    private readonly notificatorService: NotificatorService,
  ) {
    super(loggerService, tokenService, eventHistoryService);
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
        metadata,
        royalty: templateEntity.contract.royalty,
        template: templateEntity,
      });

      await this.balanceService.increment(tokenEntity.id, to.toLowerCase(), "1");
      await this.assetService.updateAssetHistory(context.transactionHash, tokenEntity);
    }

    const erc998TokenEntity = await this.tokenService.getToken(
      Number(tokenId).toString(),
      address.toLowerCase(),
      void 0,
      true,
    );

    if (!erc998TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, erc998TokenEntity.id);

    if (from === ZeroAddress) {
      erc998TokenEntity.template.amount += 1;
      // tokenEntity.template
      //   ? (erc998TokenEntity.template.instanceCount += 1)
      //   : (erc998TokenEntity.erc998Mysterybox.erc998Template.instanceCount += 1);
      erc998TokenEntity.tokenStatus = TokenStatus.MINTED;
    } else if (to === ZeroAddress) {
      // erc998TokenEntity.erc998Template.instanceCount -= 1;
      erc998TokenEntity.tokenStatus = TokenStatus.BURNED;
    } else {
      // change token's owner
      erc998TokenEntity.balance[0].account = to.toLowerCase();
    }

    await erc998TokenEntity.save();

    // need to save updates in nested entities too
    await erc998TokenEntity.template.save();
    await erc998TokenEntity.balance[0].save();

    // erc998TokenEntity.erc998Template
    //   ? await erc998TokenEntity.erc998Template.save()
    //   : await erc998TokenEntity.erc998Mysterybox.erc998Template.save();

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: from === ZeroAddress ? to.toLowerCase() : from.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();

    await this.notificatorService.tokenTransfer({
      token: erc998TokenEntity,
      from: from.toLowerCase(),
      to: to.toLowerCase(),
      amount: "1", // TODO separate notifications for native\erc20\erc721\erc998\erc1155 ?
    });
  }

  public async receivedChild(event: ILogEvent<IErc998TokenReceivedChildEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { tokenId, childContract, childTokenId },
    } = event;
    const { transactionHash } = context;

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const erc998TokenEntity = await this.tokenService.getToken(
      Number(tokenId).toString(),
      context.address.toLowerCase(),
      chainId,
      true,
    );

    if (!erc998TokenEntity) {
      throw new NotFoundException("token998NotFound");
    }

    await this.eventHistoryService.updateHistory(
      event,
      context,
      erc998TokenEntity.template.contractId,
      erc998TokenEntity.id,
    );

    const tokenEntity = await this.tokenService.getToken(
      Number(childTokenId).toString(),
      childContract.toLowerCase(),
      chainId,
    );

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.balanceService.create({
      account: erc998TokenEntity.template.contract.address,
      targetId: erc998TokenEntity.id,
      tokenId: tokenEntity.id,
      amount: "1",
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

    const erc998TokenEntity = await this.tokenService.getToken(
      Number(tokenId).toString(),
      context.address.toLowerCase(),
      void 0,
      true,
    );

    if (!erc998TokenEntity) {
      throw new NotFoundException("token998NotFound");
    }

    await this.eventHistoryService.updateHistory(
      event,
      context,
      erc998TokenEntity.id,
      erc998TokenEntity.template.contractId,
    );

    childTokenIds.map(async (childTokenId, i) => {
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

    await Promise.all(
      childTokenIds.map(async (childTokenId, i) => {
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

    await this.eventHistoryService.updateHistory(event, context, void 0, parentContractEntity.id);

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

    await this.eventHistoryService.updateHistory(event, context, void 0, parentContractEntity.id);

    const childContractEntity = await this.contractService.findOne({ address: addr.toLowerCase() });

    if (!childContractEntity) {
      throw new NotFoundException("contractChildNotFound");
    }

    await this.erc998CompositionService.delete({
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

    await this.eventHistoryService.updateHistory(event, context, void 0, parentContractEntity.id);

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

  public async levelUp(event: ILogEvent<ILevelUp>, context: Log): Promise<void> {
    const {
      name,
      args: { tokenId, attribute, value },
    } = event;
    const { address, transactionHash } = context;

    const erc998TokenEntity = await this.tokenService.getToken(tokenId, address.toLowerCase(), void 0, true);

    if (!erc998TokenEntity) {
      this.loggerService.error("tokenNotFound", tokenId, address.toLowerCase(), Erc998TokenServiceEth.name);
      throw new NotFoundException("tokenNotFound");
    }

    Object.assign(erc998TokenEntity.metadata, { [toUtf8String(stripZerosLeft(attribute))]: value });

    await erc998TokenEntity.save();

    await this.eventHistoryService.updateHistory(event, context, erc998TokenEntity.id);

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: erc998TokenEntity.balance[0].account,
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }
}
