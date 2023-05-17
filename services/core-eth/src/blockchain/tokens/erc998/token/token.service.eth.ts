import { Inject, Injectable, LoggerService, Logger, NotFoundException } from "@nestjs/common";
import { constants, providers } from "ethers";
import { Log } from "@ethersproject/abstract-provider";

import { ETHERS_RPC, ILogEvent } from "@gemunion/nestjs-ethers";

import {
  ContractEventType,
  IERC721TokenMintRandomEvent,
  IERC721TokenTransferEvent,
  IErc998BatchReceivedChildEvent,
  IErc998BatchTransferChildEvent,
  IErc998TokenReceivedChildEvent,
  IErc998TokenSetMaxChildEvent,
  IErc998TokenTransferChildEvent,
  IErc998TokenUnWhitelistedChildEvent,
  IErc998TokenWhitelistedChildEvent,
  ILevelUp,
  TokenAttributes,
  TokenStatus,
} from "@framework/types";

import { ABI } from "../../erc721/token/log/interfaces";
import { getMetadata } from "../../../../common/utils";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { TokenServiceEth } from "../../../hierarchy/token/token.service.eth";
import { OwnershipService } from "../ownership/ownership.service";
import { Erc998CompositionService } from "../composition/composition.service";
import { AssetService } from "../../../exchange/asset/asset.service";
import { EventHistoryService } from "../../../event-history/event-history.service";

@Injectable()
export class Erc998TokenServiceEth extends TokenServiceEth {
  constructor(
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: providers.JsonRpcProvider,
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    protected readonly tokenService: TokenService,
    protected readonly balanceService: BalanceService,
    protected readonly templateService: TemplateService,
    protected readonly eventHistoryService: EventHistoryService,
    protected readonly contractService: ContractService,
    protected readonly ownershipService: OwnershipService,
    protected readonly assetService: AssetService,
    protected readonly erc998CompositionService: Erc998CompositionService,
  ) {
    super(loggerService, tokenService, eventHistoryService);
  }

  public async transfer(event: ILogEvent<IERC721TokenTransferEvent>, context: Log): Promise<void> {
    const {
      args: { from, to, tokenId },
    } = event;
    const { address, transactionHash } = context;

    // Mint token create
    if (from === constants.AddressZero) {
      const attributes = await getMetadata(tokenId, address, ABI, this.jsonRpcProvider);
      const templateId = ~~attributes[TokenAttributes.TEMPLATE_ID];
      const templateEntity = await this.templateService.findOne({ id: templateId }, { relations: { contract: true } });

      if (!templateEntity) {
        throw new NotFoundException("templateNotFound");
      }

      const tokenEntity = await this.tokenService.create({
        tokenId,
        attributes,
        royalty: templateEntity.contract.royalty,
        template: templateEntity,
      });

      await this.balanceService.increment(tokenEntity.id, to.toLowerCase(), "1");
      await this.assetService.updateAssetHistory(context.transactionHash, tokenEntity.id);

      // if RANDOM token - update tokenId in exchange asset history
      if (attributes[TokenAttributes.RARITY] || attributes[TokenAttributes.GENES]) {
        const historyEntity = await this.eventHistoryService.findOne({
          transactionHash,
          eventType: ContractEventType.MintRandom,
        });
        if (!historyEntity) {
          throw new NotFoundException("historyNotFound");
        }
        const eventData = historyEntity.eventData as IERC721TokenMintRandomEvent;
        await this.assetService.updateAssetHistoryRandom(eventData.requestId, tokenEntity.id);
      }
    }

    const erc998TokenEntity = await this.tokenService.getToken(tokenId, address.toLowerCase());

    if (!erc998TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, erc998TokenEntity.id);

    if (from === constants.AddressZero) {
      erc998TokenEntity.template.amount += 1;
      // tokenEntity.template
      //   ? (erc998TokenEntity.template.instanceCount += 1)
      //   : (erc998TokenEntity.erc998Mysterybox.erc998Template.instanceCount += 1);
      erc998TokenEntity.tokenStatus = TokenStatus.MINTED;
    } else if (to === constants.AddressZero) {
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
  }

  public async receivedChild(event: ILogEvent<IErc998TokenReceivedChildEvent>, context: Log): Promise<void> {
    const {
      args: { tokenId, childContract, childTokenId },
    } = event;

    const erc998TokenEntity = await this.tokenService.getToken(tokenId, context.address.toLowerCase());

    if (!erc998TokenEntity) {
      throw new NotFoundException("token998NotFound");
    }
    await this.eventHistoryService.updateHistory(
      event,
      context,
      erc998TokenEntity.template.contractId,
      erc998TokenEntity.id,
    );

    const tokenEntity = await this.tokenService.getToken(childTokenId, childContract.toLowerCase());

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.ownershipService.create({ parentId: erc998TokenEntity.id, childId: tokenEntity.id, amount: 1 });
  }

  public async receivedChildBatch(event: ILogEvent<IErc998BatchReceivedChildEvent>, context: Log): Promise<void> {
    const {
      args: { tokenId, childContract, childTokenIds, amounts },
    } = event;

    const erc998TokenEntity = await this.tokenService.getToken(tokenId, context.address.toLowerCase());

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
      const childTokenEntity = await this.tokenService.getToken(childTokenId, childContract.toLowerCase());

      if (!childTokenEntity) {
        throw new NotFoundException("childTokenNotFound");
      }

      await this.ownershipService.create({
        parentId: erc998TokenEntity.id,
        childId: childTokenEntity.id,
        amount: ~~amounts[i],
      });
    });
  }

  public async transferChild(event: ILogEvent<IErc998TokenTransferChildEvent>, context: Log): Promise<void> {
    const {
      args: { childContract, childTokenId },
    } = event;

    const erc721TokenEntity = await this.tokenService.getToken(childTokenId, childContract.toLowerCase());

    if (!erc721TokenEntity) {
      throw new NotFoundException("token721NotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, erc721TokenEntity.id);

    const ownershipEntity = await this.ownershipService.findOne({ childId: erc721TokenEntity.id });

    if (!ownershipEntity) {
      throw new NotFoundException("ownershipNotFound");
    }

    await this.ownershipService.delete({ id: ownershipEntity.id });
  }

  public async transferChildBatch(event: ILogEvent<IErc998BatchTransferChildEvent>, context: Log): Promise<void> {
    const {
      args: { childContract, childTokenIds, amounts },
    } = event;

    await Promise.all(
      childTokenIds.map(async (childTokenId, i) => {
        const childTokenEntity = await this.tokenService.getToken(childTokenId, childContract.toLowerCase());

        if (!childTokenEntity) {
          throw new NotFoundException("childTokenNotFound");
        }

        await this.eventHistoryService.updateHistory(event, context, childTokenEntity.id);

        const ownershipEntity = await this.ownershipService.findOne({ childId: childTokenEntity.id });

        if (!ownershipEntity) {
          throw new NotFoundException("ownershipNotFound");
        }

        if (ownershipEntity.amount > ~~amounts[i]) {
          Object.assign(ownershipEntity, { amount: ownershipEntity.amount - ~~amounts[i] });
          await ownershipEntity.save();
        } else {
          await this.ownershipService.delete({ id: ownershipEntity.id });
        }
      }),
    );
  }

  public async mintRandom(event: ILogEvent<IERC721TokenMintRandomEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }

  public async whitelistChild(event: ILogEvent<IErc998TokenWhitelistedChildEvent>, context: Log): Promise<void> {
    const {
      args: { addr, maxCount },
    } = event;
    const { address } = context;
    const parentContractEntity = await this.contractService.findOne({ address: address.toLowerCase() });

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
      amount: ~~maxCount,
    });
  }

  public async unWhitelistChild(event: ILogEvent<IErc998TokenUnWhitelistedChildEvent>, context: Log): Promise<void> {
    const {
      args: { addr },
    } = event;
    const { address } = context;

    const parentContractEntity = await this.contractService.findOne({ address: address.toLowerCase() });

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
  }

  public async setMaxChild(event: ILogEvent<IErc998TokenSetMaxChildEvent>, context: Log): Promise<void> {
    const {
      args: { addr, maxCount },
    } = event;
    const { address } = context;

    const parentContractEntity = await this.contractService.findOne({ address: address.toLowerCase() });

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

    Object.assign(compositionEntity, { amount: ~~maxCount });
    await compositionEntity.save();
  }

  public async levelUp(event: ILogEvent<ILevelUp>, context: Log): Promise<void> {
    const {
      args: { tokenId, grade },
    } = event;
    const { address } = context;

    const erc998TokenEntity = await this.tokenService.getToken(tokenId, address.toLowerCase());

    if (!erc998TokenEntity) {
      this.loggerService.error("tokenNotFound", tokenId, address.toLowerCase(), Erc998TokenServiceEth.name);
      throw new NotFoundException("tokenNotFound");
    }

    Object.assign(erc998TokenEntity.attributes, { GRADE: grade.toString() });
    await erc998TokenEntity.save();

    await this.eventHistoryService.updateHistory(event, context, erc998TokenEntity.id);
  }
}
