import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { BigNumber, constants, providers } from "ethers";
import { Log } from "@ethersproject/abstract-provider";
import { ETHERS_RPC, ILogEvent } from "@gemunion/nestjs-ethers";
import { DeepPartial } from "typeorm";

import {
  ContractEventType,
  IERC721ConsecutiveTransfer,
  IERC721TokenMintRandomEvent,
  IERC721TokenTransferEvent,
  TokenAttributes,
  TokenStatus,
} from "@framework/types";

import { ABI } from "./log/interfaces";
import { getMetadata } from "../../../../common/utils";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { TokenServiceEth } from "../../../hierarchy/token/token.service.eth";
import { AssetService } from "../../../exchange/asset/asset.service";
import { BreedServiceEth } from "../../../mechanics/breed/breed.service.eth";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { BalanceEntity } from "../../../hierarchy/balance/balance.entity";
import { EventHistoryService } from "../../../event-history/event-history.service";

@Injectable()
export class Erc721TokenServiceEth extends TokenServiceEth {
  constructor(
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: providers.JsonRpcProvider,
    protected readonly tokenService: TokenService,
    protected readonly templateService: TemplateService,
    protected readonly balanceService: BalanceService,
    protected readonly assetService: AssetService,
    protected readonly breedServiceEth: BreedServiceEth,
    protected readonly eventHistoryService: EventHistoryService,
  ) {
    super(tokenService, eventHistoryService);
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
        templateId: templateEntity.id,
      });
      await this.balanceService.increment(tokenEntity.id, to.toLowerCase(), "1");
      await this.assetService.updateAssetHistory(transactionHash, tokenEntity.id);

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

      // MODULE:BREEDING
      if (attributes[TokenAttributes.GENES]) {
        await this.breedServiceEth.newborn(
          tokenEntity.id,
          attributes[TokenAttributes.GENES],
          context.transactionHash.toLowerCase(),
        );
      }
    }

    const erc721TokenEntity = await this.tokenService.getToken(tokenId, address.toLowerCase());

    if (!erc721TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, erc721TokenEntity.id);

    if (from === constants.AddressZero) {
      erc721TokenEntity.template.amount += 1;
      erc721TokenEntity.tokenStatus = TokenStatus.MINTED;
    } else if (to === constants.AddressZero) {
      erc721TokenEntity.tokenStatus = TokenStatus.BURNED;
    } else {
      // change token's owner
      erc721TokenEntity.balance[0].account = to.toLowerCase();
    }

    await erc721TokenEntity.save();
    // need to save updates in nested entities too
    await erc721TokenEntity.template.save();
    await erc721TokenEntity.balance[0].save();
  }

  public async consecutiveTransfer(event: ILogEvent<IERC721ConsecutiveTransfer>, context: Log): Promise<void> {
    const {
      args: { fromAddress, toAddress, fromTokenId, toTokenId },
    } = event;
    const { address } = context;

    // Mint token create batch
    if (fromAddress === constants.AddressZero) {
      const templateEntity = await this.templateService.findOne(
        { contract: { address } },
        { relations: { contract: true } },
      );

      if (!templateEntity) {
        throw new NotFoundException("templateNotFound");
      }
      await this.eventHistoryService.updateHistory(event, context, void 0, templateEntity.contract.id);

      const batchSize = JSON.parse(templateEntity.contract.description).batchSize
        ? JSON.parse(templateEntity.contract.description).batchSize
        : 0;

      const batchLen = BigNumber.from(toTokenId).sub(fromTokenId).toNumber();

      if (batchLen !== batchSize) {
        // todo just in case =)
        throw new NotFoundException("batchLengthError");
      }

      templateEntity.amount += batchSize;
      await templateEntity.save();

      const tokenArray: Array<DeepPartial<TokenEntity>> = [...Array(batchSize)].map((_, i) => ({
        attributes: "{}",
        tokenId: i.toString(),
        royalty: templateEntity.contract.royalty,
        templateId: templateEntity.id,
        tokenStatus: TokenStatus.MINTED,
      }));

      const entityArray = await this.tokenService.createBatch(tokenArray);

      await this.createBalancesBatch(toAddress, entityArray);
      // await this.assetService.updateAssetHistory(transactionHash, tokenEntity.id);
    }
  }

  private async createBalancesBatch(owner: string, tokenArray: Array<TokenEntity>) {
    const balanceArray: Array<DeepPartial<BalanceEntity>> = [...Array(tokenArray.length)].map((_, i) => ({
      account: owner.toLowerCase(),
      amount: "1",
      tokenId: tokenArray[i].id,
    }));

    await this.balanceService.createBatch(balanceArray);
  }

  public async mintRandom(event: ILogEvent<IERC721TokenMintRandomEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }
}
