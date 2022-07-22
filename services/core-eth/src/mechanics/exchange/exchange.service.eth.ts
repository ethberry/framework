import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import { ExchangeEventType, ITransaction, TExchangeEventData } from "@framework/types";

import { ContractManagerService } from "../../blockchain/contract-manager/contract-manager.service";
import { BalanceService } from "../../blockchain/hierarchy/balance/balance.service";
import { ExchangeHistoryService } from "./exchange-history/exchange-history.service";
import { ExchangeService } from "./exchange.service";
import { TemplateService } from "../../blockchain/hierarchy/template/template.service";
import { TokenService } from "../../blockchain/hierarchy/token/token.service";

@Injectable()
export class ExchangeServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly contractManagerService: ContractManagerService,
    private readonly exchangeService: ExchangeService,
    private readonly exchangeHistoryService: ExchangeHistoryService,
    private readonly templateService: TemplateService,
    private readonly tokenService: TokenService,
    private readonly balanceService: BalanceService,
  ) {}

  public async purchase(event: ILogEvent<ITransaction>, context: Log): Promise<void> {
    await this.updateHistory(event, context);

    // TODO update claim status

    //
    // const {
    //   args: { from, items },
    // } = event;
    //
    // // Array<IAsset>
    // items.map(async (item: [number, string, string, string]) => {
    //   const itemTokenId = item[2];
    //   const itemTokenAmount = item[3];
    //   console.log("transaction!item", item);
    //
    //   const templateEntity = await this.templateService.findOne(
    //     { id: ~~itemTokenId },
    //     { relations: { contract: true } },
    //   );
    //
    //   if (!templateEntity) {
    //     throw new NotFoundException("templateNotFound");
    //   }
    //
    //   // Create simple ERC721 or ERC998 tokens without template metadata
    //   if (
    //     (templateEntity.contract.contractType === TokenType.ERC721 ||
    //       templateEntity.contract.contractType === TokenType.ERC998) &&
    //     templateEntity.contract.contractTemplate === ContractTemplate.SIMPLE
    //   ) {
    //     const tokenEntity = await this.tokenService.create({
    //       tokenId: itemTokenId,
    //       attributes: templateEntity.attributes,
    //       royalty: templateEntity.contract.royalty,
    //       template: templateEntity,
    //     });
    //     await this.balanceService.increment(tokenEntity.id, from.toLowerCase(), itemTokenAmount);
    //   }
    // });
  }

  private async updateHistory(event: ILogEvent<TExchangeEventData>, context: Log) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), ExchangeServiceEth.name);

    const { args, name } = event;

    const { transactionHash, address, blockNumber } = context;

    await this.exchangeHistoryService.create({
      address,
      transactionHash,
      eventType: name as ExchangeEventType,
      eventData: args,
    });

    await this.contractManagerService.updateLastBlockByAddr(
      context.address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
