import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";

import { Log } from "@ethersproject/abstract-provider";
import { constants } from "ethers";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  IERC721TokenTransferEvent,
  ILotteryPurchaseEvent,
  LotteryEventType,
  TLotteryEventData,
  TokenStatus,
} from "@framework/types";

import { LotteryTicketService } from "./ticket.service";
import { LotteryHistoryService } from "../history/history.service";
import { LotteryRoundService } from "../round/round.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { TokenServiceEth } from "../../../hierarchy/token/token.service.eth";
import { TokenEntity } from "../../../hierarchy/token/token.entity";

@Injectable()
export class LotteryTicketServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly lotteryTicketService: LotteryTicketService,
    private readonly lotteryRoundService: LotteryRoundService,
    private readonly lotteryHistoryService: LotteryHistoryService,
    private readonly contractService: ContractService,
    private readonly templateService: TemplateService,
    private readonly tokenService: TokenService,
    private readonly tokenServiceEth: TokenServiceEth,
    protected readonly balanceService: BalanceService,
  ) {}

  public async purchase(event: ILogEvent<ILotteryPurchaseEvent>, context: Log): Promise<void> {
    await this.updateHistory(event, context);

    const {
      args: { tokenId, account, price, round, numbers },
    } = event;

    const roundEntity = await this.lotteryRoundService.findOne({ roundId: round });

    if (!roundEntity) {
      throw new NotFoundException("roundNotFound");
    }

    const tokenEntity = await this.createTicketToken(tokenId, account);

    await this.lotteryTicketService.create({
      account: account.toLowerCase(),
      numbers,
      amount: price,
      roundId: roundEntity.id,
      tokenId: tokenEntity.id,
    });
  }

  public async createTicketToken(tokenId: string, account: string): Promise<TokenEntity> {
    // LOTTERY Ticket Template 801001
    const templateEntity = await this.templateService.findOne({ id: 801001 }, { relations: { contract: true } });

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const tokenEntity = await this.tokenService.create({
      tokenId,
      attributes: "{}",
      royalty: templateEntity.contract.royalty,
      templateId: templateEntity.id,
      tokenStatus: TokenStatus.MINTED,
    });

    await this.balanceService.increment(tokenEntity.id, account.toLowerCase(), "1");

    return tokenEntity;
  }

  public async transfer(event: ILogEvent<IERC721TokenTransferEvent>, context: Log): Promise<void> {
    const {
      args: { from, to, tokenId },
    } = event;
    const { address } = context;

    // create token at LOTTERY PURCHASE EVENT
    if (from !== constants.AddressZero) {
      const erc721TokenEntity = await this.tokenService.getToken(tokenId, address.toLowerCase());

      if (!erc721TokenEntity) {
        throw new NotFoundException("tokenNotFound");
      }

      await this.tokenServiceEth.updateHistory(event, context, void 0, erc721TokenEntity.id);

      if (from === constants.AddressZero) {
        // LOTTERY PURCHASE EVENT
      } else if (to === constants.AddressZero) {
        erc721TokenEntity.tokenStatus = TokenStatus.BURNED;
      } else {
        // change token's owner
        erc721TokenEntity.balance[0].account = to.toLowerCase();
      }

      await erc721TokenEntity.save();
      // need to save updates in nested entities too
      await erc721TokenEntity.balance[0].save();
    }
  }

  private async updateHistory(event: ILogEvent<TLotteryEventData>, context: Log) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), LotteryTicketServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.lotteryHistoryService.create({
      address: address.toLowerCase(),
      transactionHash: transactionHash.toLowerCase(),
      eventType: name as LotteryEventType,
      eventData: args,
    });

    await this.contractService.updateLastBlockByAddr(address.toLowerCase(), parseInt(blockNumber.toString(), 16));
  }
}
