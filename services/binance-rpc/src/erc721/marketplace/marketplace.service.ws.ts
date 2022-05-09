import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";

import { IEvent } from "@gemunion/nestjs-web3";
import {
  Erc721MarketplaceEventType,
  IErc721MarketplaceRedeem,
  TErc721MarketplaceEventData,
  TokenRarity,
} from "@framework/types";

import { Erc721MarketplaceHistoryService } from "../marketplace-history/marketplace-history.service";
import { Erc721TokenService } from "../token/token.service";
import { Erc721TemplateService } from "../template/template.service";
import { Erc721DropboxService } from "../dropbox/dropbox.service";

@Injectable()
export class Erc721MarketplaceServiceWs {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly erc721MarketplaceHistoryService: Erc721MarketplaceHistoryService,
    private readonly erc721TokenService: Erc721TokenService,
    private readonly erc721TemplateService: Erc721TemplateService,
    private readonly erc721DropboxService: Erc721DropboxService,
  ) {}

  public async redeem(event: IEvent<IErc721MarketplaceRedeem>): Promise<void> {
    const {
      returnValues: { from, tokenId, templateId },
    } = event;

    const erc721TemplateEntity = await this.erc721TemplateService.findOne({ id: ~~templateId });

    if (!erc721TemplateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const erc721TokenEntity = await this.erc721TokenService.create({
      tokenId,
      attributes: erc721TemplateEntity.attributes,
      rarity: TokenRarity.COMMON,
      owner: from.toLowerCase(),
      erc721Template: erc721TemplateEntity,
    });

    await this.updateHistory(event, erc721TokenEntity.id);
  }

  public async redeemDropbox(event: IEvent<IErc721MarketplaceRedeem>): Promise<void> {
    const {
      returnValues: { from, tokenId, templateId },
    } = event;

    const erc721DropboxEntity = await this.erc721DropboxService.findOne({ id: ~~templateId });

    if (!erc721DropboxEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const erc721TokenEntity = await this.erc721TokenService.create({
      tokenId,
      attributes: {},
      rarity: TokenRarity.UNKNOWN,
      owner: from.toLowerCase(),
      erc721Dropbox: erc721DropboxEntity,
    });

    await this.updateHistory(event, erc721TokenEntity.id);
  }

  private async updateHistory(event: IEvent<TErc721MarketplaceEventData>, erc721TokenId: number) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), Erc721MarketplaceServiceWs.name);

    const { returnValues, event: eventType, transactionHash, address } = event;

    return await this.erc721MarketplaceHistoryService.create({
      address: address.toLowerCase(),
      transactionHash: transactionHash.toLowerCase(),
      eventType: eventType as Erc721MarketplaceEventType,
      eventData: returnValues,
      erc721TokenId,
    });
  }
}
