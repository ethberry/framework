import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  Erc721MarketplaceEventType,
  IErc721MarketplaceRedeem,
  TErc721MarketplaceEventData,
  TokenRarity,
} from "@framework/types";

import { ContractManagerService } from "../../blockchain/contract-manager/contract-manager.service";
import { Erc721MarketplaceHistoryService } from "./marketplace-history/marketplace-history.service";
import { TemplateService } from "../../blockchain/hierarchy/template/template.service";
import { TokenService } from "../../blockchain/hierarchy/token/token.service";
import { BalanceService } from "../../blockchain/hierarchy/balance/balance.service";
// import { Erc721DropboxService } from "../../mechanics/dropbox/dropbox.service";

@Injectable()
export class Erc721MarketplaceServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly contractManagerService: ContractManagerService,
    private readonly erc721MarketplaceHistoryService: Erc721MarketplaceHistoryService,
    private readonly tokenService: TokenService,
    private readonly balanceService: BalanceService,
    private readonly templateService: TemplateService, // private readonly erc721DropboxService: Erc721DropboxService,
  ) {}

  public async redeem(event: ILogEvent<IErc721MarketplaceRedeem>, context: Log): Promise<void> {
    const {
      args: { from, tokenId, templateId },
    } = event;

    const erc721TemplateEntity = await this.templateService.findOne({ id: ~~templateId });

    if (!erc721TemplateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const erc721TokenEntity = await this.tokenService.create({
      tokenId,
      attributes: Object.assign(erc721TemplateEntity.attributes, {
        rarity: TokenRarity.COMMON,
      }),
      royalty: erc721TemplateEntity.contract.royalty,
      template: erc721TemplateEntity,
    });

    await this.balanceService.create({
      account: from.toLowerCase(),
      amount: "1",
      tokenId: erc721TokenEntity.id,
    });

    await this.updateHistory(event, erc721TokenEntity.id, context);
  }

  // public async redeemDropbox(event: ILogEvent<IErc721MarketplaceRedeem>, context: Log): Promise<void> {
  //   const {
  //     args: { from, tokenId, templateId },
  //   } = event;
  //
  //   const erc721DropboxEntity = await this.erc721DropboxService.findOne({ templateIds: ~~templateId });
  //
  //   if (!erc721DropboxEntity) {
  //     throw new NotFoundException("templateNotFound");
  //   }
  //
  //   const erc721TokenEntity = await this.tokenService.create({
  //     tokenId,
  //     attributes: {},
  //     owner: from.toLowerCase(),
  //     // erc721Dropbox: erc721DropboxEntity,
  //   });
  //
  //   await this.updateHistory(event, erc721TokenEntity.id, context);
  // }

  private async updateHistory(event: ILogEvent<TErc721MarketplaceEventData>, tokenId: number, context: Log) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), Erc721MarketplaceServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.erc721MarketplaceHistoryService.create({
      address: address.toLowerCase(),
      transactionHash: transactionHash.toLowerCase(),
      eventType: name as Erc721MarketplaceEventType,
      eventData: args,
      tokenId,
    });

    await this.contractManagerService.updateLastBlockByAddr(
      context.address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
