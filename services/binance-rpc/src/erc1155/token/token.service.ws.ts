import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { constants } from "ethers";
import { Log } from "web3-core";

import { ILogEvent } from "@gemunion/nestjs-web3";
import {
  Erc1155TokenEventType,
  IErc1155RoleGrant,
  IErc1155TokenApprovalForAll,
  IErc1155TokenTransferBatch,
  IErc1155TokenTransferSingle,
  IErc1155TokenUri,
  TErc1155TokenEventData,
} from "@framework/types";

import { Erc1155TokenHistoryService } from "../token-history/token-history.service";
import { Erc1155BalanceService } from "../balance/balance.service";
import { Erc1155TokenService } from "./token.service";

@Injectable()
export class Erc1155TokenServiceWs {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly erc1155TokenHistoryService: Erc1155TokenHistoryService,
    private readonly erc1155BalanceService: Erc1155BalanceService,
    private readonly erc1155TokenService: Erc1155TokenService,
  ) {}

  public async transferSingle(event: ILogEvent<IErc1155TokenTransferSingle>, context: Log): Promise<void> {
    const {
      args: { from, to, id, value },
    } = event;

    await this.updateHistory(event, context);

    await this.updateBalances(from.toLowerCase(), to.toLowerCase(), context.address.toLowerCase(), id, ~~value);
  }

  public async transferBatch(event: ILogEvent<IErc1155TokenTransferBatch>, context: Log): Promise<void> {
    const {
      args: { from, to, ids, values },
    } = event;

    await this.updateHistory(event, context);

    await Promise.all(
      ids.map((tokenId: string, i: number) =>
        this.updateBalances(
          from.toLowerCase(),
          to.toLowerCase(),
          context.address.toLowerCase(),
          tokenId.toString(),
          ~~values[i],
        ),
      ),
    );
  }

  public async approvalForAll(event: ILogEvent<IErc1155TokenApprovalForAll>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async uri(event: ILogEvent<IErc1155TokenUri>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async roleGrant(event: ILogEvent<IErc1155RoleGrant>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async roleRevoke(event: ILogEvent<IErc1155RoleGrant>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  private async updateBalances(from: string, to: string, address: string, tokenId: string, amount: number) {
    const erc1155TokenEntity = await this.erc1155TokenService.getToken(tokenId, address);

    if (!erc1155TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    if (from !== constants.AddressZero) {
      erc1155TokenEntity.instanceCount += amount;
      await this.erc1155BalanceService.decrement(erc1155TokenEntity.id, from, amount);
    }

    if (to !== constants.AddressZero) {
      // erc1155TokenEntity.instanceCount -= amount;
      await this.erc1155BalanceService.increment(erc1155TokenEntity.id, to, amount);
    }
  }

  private async updateHistory(event: ILogEvent<TErc1155TokenEventData>, context: Log) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), Erc1155TokenServiceWs.name);

    const { args, name: eventType } = event;
    const { transactionHash, address } = context;

    await this.erc1155TokenHistoryService.create({
      address: address.toLowerCase(),
      transactionHash: transactionHash.toLowerCase(),
      eventType: eventType as Erc1155TokenEventType,
      eventData: JSON.parse(JSON.stringify(Object.fromEntries(Object.entries(args).splice(args.length)))),
    });
  }
}
