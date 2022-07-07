import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  Erc998MarketplaceEventType,
  IErc998MarketplaceRedeem,
  TErc998MarketplaceEventData,
  TokenRarity,
} from "@framework/types";

import { ContractManagerService } from "../../blockchain/contract-manager/contract-manager.service";
import { Erc998MarketplaceHistoryService } from "./marketplace-history/marketplace-history.service";
import { TemplateService } from "../../blockchain/hierarchy/template/template.service";
import { TokenService } from "../../blockchain/hierarchy/token/token.service";
import { BalanceService } from "../../blockchain/hierarchy/balance/balance.service";

@Injectable()
export class Erc998MarketplaceServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly contractManagerService: ContractManagerService,
    private readonly erc998MarketplaceHistoryService: Erc998MarketplaceHistoryService,
    private readonly templateService: TemplateService,
    private readonly tokenService: TokenService,
    private readonly balanceService: BalanceService,
  ) {}

  public async redeem(event: ILogEvent<IErc998MarketplaceRedeem>, context: Log): Promise<void> {
    const {
      args: { from, tokenId, templateId },
    } = event;

    const erc998TemplateEntity = await this.templateService.findOne({ id: ~~templateId });

    if (!erc998TemplateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const erc998TokenEntity = await this.tokenService.create({
      tokenId,
      attributes: Object.assign(erc998TemplateEntity.attributes, {
        rarity: TokenRarity.COMMON,
      }),
      royalty: erc998TemplateEntity.contract.royalty,
      template: erc998TemplateEntity,
    });

    await this.balanceService.create({
      account: from.toLowerCase(),
      amount: "1",
      tokenId: erc998TokenEntity.id,
    });

    await this.updateHistory(event, erc998TokenEntity.id, context);
  }

  // public async redeemDropbox(event: ILogEvent<IErc998MarketplaceRedeem>, context: Log): Promise<void> {
  //   const {
  //     args: { from, tokenId, templateId },
  //   } = event;
  //
  //   const erc998DropboxEntity = await this.erc998DropboxService.findOne({ erc998TemplateId: ~~templateId });
  //
  //   if (!erc998DropboxEntity) {
  //     throw new NotFoundException("templateNotFound");
  //   }
  //
  //   const erc998TokenEntity = await this.tokenService.create({
  //     tokenId,
  //     attributes: {},
  //     owner: from.toLowerCase(),
  //     erc998Dropbox: erc998DropboxEntity,
  //   });
  //
  //   await this.updateHistory(event, erc998TokenEntity.id, context);
  // }

  private async updateHistory(event: ILogEvent<TErc998MarketplaceEventData>, tokenId: number, context: Log) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), Erc998MarketplaceServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.erc998MarketplaceHistoryService.create({
      address: address.toLowerCase(),
      transactionHash: transactionHash.toLowerCase(),
      eventType: name as Erc998MarketplaceEventType,
      eventData: args,
      tokenId,
    });

    await this.contractManagerService.updateLastBlockByAddr(
      context.address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
